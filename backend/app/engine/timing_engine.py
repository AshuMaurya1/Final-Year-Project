"""
Rule-Based Dynamic Signal-Timing Engine.
Implements Proportional Time Allocation within Safety Bounds (Equation 7)
from "AI-Based Traffic Congestion Prediction and Adaptive Signal Control: A Comparative Review"
(Maurya et al., AKGEC, Ghaziabad).
"""

from typing import Dict, List, Tuple, Optional
from ..config import config
from ..models.schemas import PredictionOutput, TimingDecision, AlertItem
from .safety import SafetyGuard

class DynamicTimingEngine:
    def __init__(self):
        self.safety = SafetyGuard()
        self.min_g = config.timing.min_green
        self.max_g = config.timing.max_green
        self.yellow = config.timing.yellow_duration
        self.all_red = config.timing.all_red_duration
        self.fallback_g = config.timing.default_fixed_green
        # Cycle green budget G = 90s - (2 * (4s yellow + 2s all-red)) = 78s
        self.total_green_budget = 90 - (2 * (self.yellow + self.all_red))

    def calculate_phase_timings(
        self, 
        predictions: Dict[str, PredictionOutput],
        queue_lengths: Dict[str, int],
        emergency_approach: Optional[str] = None,
        vision_confidence: float = 0.94
    ) -> Tuple[Dict[str, TimingDecision], List[AlertItem]]:
        """
        Calculates optimal green durations for NS and EW phases using Equation (7):
        g_k = min(g_max, g_min + (G - K*g_min) * (q_hat_k / sum(q_hat_j)))
        followed by normalization to ensure sum(g_k) == G.
        Falls back to safe actuated/fixed plan when detection confidence is low (< 0.65).
        """
        decisions: Dict[str, TimingDecision] = {}
        alerts: List[AlertItem] = []

        # 1. Fallback check on low vision confidence (Section VIII-C)
        if vision_confidence < 0.65:
            alert = AlertItem(
                id="SAFETY-FALLBACK-LOW-CONF",
                severity="WARNING",
                category="SAFETY",
                message=f"Vision confidence degraded ({vision_confidence:.2f} < 0.65). Reverting to safety-bounded baseline plan."
            )
            alerts.append(alert)
            for app in config.intersection.approaches:
                decisions[app] = TimingDecision(
                    approach=app,
                    recommended_green_sec=self.fallback_g,
                    yellow_sec=self.yellow,
                    all_red_sec=self.all_red,
                    congestion_level="Medium",
                    reason="Low vision confidence fallback: Reverted to 30s default green."
                )
            return decisions, alerts

        # 2. Emergency Preemption Check (Continuous priority green)
        if emergency_approach and emergency_approach in config.intersection.approaches:
            alert = AlertItem(
                id=f"EMERGENCY-PREEMPTION-{emergency_approach}",
                severity="CRITICAL",
                category="OVERRIDE",
                message=f"Emergency vehicle preemption active on {emergency_approach}! Continuous maximum green granted."
            )
            alerts.append(alert)

            for app in config.intersection.approaches:
                if app == emergency_approach:
                    green = self.max_g
                    reason = f"Emergency vehicle priority override (Max green: {self.max_g}s)"
                    level = "High"
                else:
                    green = self.min_g
                    reason = f"Yielding to emergency corridor on {emergency_approach} (Min green: {self.min_g}s)"
                    level = predictions.get(app, PredictionOutput(approach=app, predicted_density=10.0, congestion_level="Low")).congestion_level

                decisions[app] = TimingDecision(
                    approach=app,
                    recommended_green_sec=green,
                    yellow_sec=self.yellow,
                    all_red_sec=self.all_red,
                    congestion_level=level,
                    reason=reason
                )
            return decisions, alerts

        # 3. Calculate Phase Predicted Queues (q_hat_k,n+1)
        # Phase 1: North-South corridor, Phase 2: East-West corridor
        q_ns = max(
            queue_lengths.get("North", 0), 
            queue_lengths.get("South", 0)
        )
        q_ew = max(
            queue_lengths.get("East", 0), 
            queue_lengths.get("West", 0)
        )

        # Scale with predicted demand density if available
        dens_ns = max(predictions.get("North", PredictionOutput(approach="North", predicted_density=25.0, congestion_level="Medium")).predicted_density,
                      predictions.get("South", PredictionOutput(approach="South", predicted_density=25.0, congestion_level="Medium")).predicted_density)
        dens_ew = max(predictions.get("East", PredictionOutput(approach="East", predicted_density=25.0, congestion_level="Medium")).predicted_density,
                      predictions.get("West", PredictionOutput(approach="West", predicted_density=25.0, congestion_level="Medium")).predicted_density)

        q_hat_ns = max(1.0, float(q_ns) * 1.1 + (dens_ns / 30.0))
        q_hat_ew = max(1.0, float(q_ew) * 1.1 + (dens_ew / 30.0))
        total_q_hat = q_hat_ns + q_hat_ew

        # 4. Proportional Allocation Rule (Equation 7)
        # g_k = min(g_max, g_min + (G - K * g_min) * (q_hat_k / sum(q_hat_j)))
        K = 2
        G = self.total_green_budget
        surplus_pool = G - (K * self.min_g)  # 78 - 20 = 58s

        raw_g_ns = self.min_g + surplus_pool * (q_hat_ns / total_q_hat)
        raw_g_ew = self.min_g + surplus_pool * (q_hat_ew / total_q_hat)

        # Clamping within bounds [g_min, g_max]
        clamped_g_ns = min(self.max_g, max(self.min_g, raw_g_ns))
        clamped_g_ew = min(self.max_g, max(self.min_g, raw_g_ew))

        # Normalization step to ensure total green time equals G (78s)
        alloc_sum = clamped_g_ns + clamped_g_ew
        if alloc_sum > 0:
            norm_factor = G / alloc_sum
            final_g_ns = int(round(clamped_g_ns * norm_factor))
            final_g_ew = G - final_g_ns
        else:
            final_g_ns = G // 2
            final_g_ew = G - final_g_ns

        # Validate with SafetyGuard
        final_g_ns, ns_alert = self.safety.validate_timings(final_g_ns, "North-South Corridor")
        final_g_ew, ew_alert = self.safety.validate_timings(final_g_ew, "East-West Corridor")
        if ns_alert: alerts.append(ns_alert)
        if ew_alert: alerts.append(ew_alert)

        # 5. Populate Decisions
        for app in ["North", "South"]:
            pred = predictions.get(app)
            level = pred.congestion_level if pred else "Medium"
            decisions[app] = TimingDecision(
                approach=app,
                recommended_green_sec=final_g_ns,
                yellow_sec=self.yellow,
                all_red_sec=self.all_red,
                congestion_level=level,
                reason=f"Eq. (7) Allocation: q̂_NS={q_hat_ns:.1f} -> Allocated {final_g_ns}s (Safety Bounds: [{self.min_g}s, {self.max_g}s])"
            )

        for app in ["East", "West"]:
            pred = predictions.get(app)
            level = pred.congestion_level if pred else "Medium"
            decisions[app] = TimingDecision(
                approach=app,
                recommended_green_sec=final_g_ew,
                yellow_sec=self.yellow,
                all_red_sec=self.all_red,
                congestion_level=level,
                reason=f"Eq. (7) Allocation: q̂_EW={q_hat_ew:.1f} -> Allocated {final_g_ew}s (Safety Bounds: [{self.min_g}s, {self.max_g}s])"
            )

        return decisions, alerts

    def get_fallback_timings(self, reason: str = "Sensor/ML failure") -> Tuple[Dict[str, TimingDecision], List[AlertItem]]:
        """Failsafe fallback fixed-time schedule (30s green each direction)."""
        alert = AlertItem(
            id="FAILSAFE-FALLBACK-TRIGGERED",
            severity="ERROR",
            category="TIMING",
            message=f"Safe Fallback Engaged: {reason}. Signal reverted to fixed 30s cycle."
        )
        decisions = {}
        for app in config.intersection.approaches:
            decisions[app] = TimingDecision(
                approach=app,
                recommended_green_sec=self.fallback_g,
                yellow_sec=self.yellow,
                all_red_sec=self.all_red,
                congestion_level="Medium",
                reason=f"Safe Fallback Default: {reason}"
            )
        return decisions, [alert]

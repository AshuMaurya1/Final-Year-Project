"""
Rule-Based Dynamic Signal-Timing Engine.
Translates ML congestion predictions and queue estimates into safe, optimal green durations.
"""

from typing import Dict, List, Tuple
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

    def calculate_phase_timings(
        self, 
        predictions: Dict[str, PredictionOutput],
        queue_lengths: Dict[str, int],
        emergency_approach: str = None
    ) -> Tuple[Dict[str, TimingDecision], List[AlertItem]]:
        """
        Calculates optimal green durations for NS and EW phases.
        Accounts for emergency vehicle preemption and safety clamps.
        """
        decisions: Dict[str, TimingDecision] = {}
        alerts: List[AlertItem] = []

        # 1. Emergency Preemption Check
        if emergency_approach and emergency_approach in config.intersection.approaches:
            alert = AlertItem(
                id=f"EMERGENCY-PREEMPTION-{emergency_approach}",
                severity="WARNING",
                category="OVERRIDE",
                message=f"Emergency vehicle preemption active on {emergency_approach}! Granting maximum safe priority green."
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

        # 2. Extract densities and compute approach weights
        densities = {
            app: predictions[app].predicted_density if app in predictions else 25.0
            for app in config.intersection.approaches
        }

        # Calculate phase-aggregated demand
        # Phase NS: max demand of North and South
        # Phase EW: max demand of East and West
        ns_density = max(densities.get("North", 25.0), densities.get("South", 25.0))
        ew_density = max(densities.get("East", 25.0), densities.get("West", 25.0))
        total_density = ns_density + ew_density
        if total_density <= 0:
            total_density = 50.0

        # Cycle time available for green: 90s standard cycle - yellow and all-red clearance
        available_green_budget = 90 - (2 * (self.yellow + self.all_red))  # ~78s total green pool

        raw_ns_green = int((ns_density / total_density) * available_green_budget)
        raw_ew_green = available_green_budget - raw_ns_green

        # Queue length adjustment: extra 1.5s per vehicle in queue beyond 5
        ns_queue_bonus = int(max(0, max(queue_lengths.get("North", 0), queue_lengths.get("South", 0)) - 5) * 1.5)
        ew_queue_bonus = int(max(0, max(queue_lengths.get("East", 0), queue_lengths.get("West", 0)) - 5) * 1.5)

        raw_ns_green += ns_queue_bonus
        raw_ew_green += ew_queue_bonus

        # Apply Safety Clamps
        ns_green, ns_alert = self.safety.validate_timings(raw_ns_green, "North-South Corridor")
        ew_green, ew_alert = self.safety.validate_timings(raw_ew_green, "East-West Corridor")
        if ns_alert:
            alerts.append(ns_alert)
        if ew_alert:
            alerts.append(ew_alert)

        # Build Decision objects for all 4 approaches
        for app in ["North", "South"]:
            pred = predictions.get(app)
            level = pred.congestion_level if pred else "Medium"
            density = densities.get(app, 25.0)
            q = queue_lengths.get(app, 0)
            decisions[app] = TimingDecision(
                approach=app,
                recommended_green_sec=ns_green,
                yellow_sec=self.yellow,
                all_red_sec=self.all_red,
                congestion_level=level,
                reason=f"Adaptive demand: {density:.1f} veh/min, Queue: {q} veh -> Allocated {ns_green}s"
            )

        for app in ["East", "West"]:
            pred = predictions.get(app)
            level = pred.congestion_level if pred else "Medium"
            density = densities.get(app, 25.0)
            q = queue_lengths.get(app, 0)
            decisions[app] = TimingDecision(
                approach=app,
                recommended_green_sec=ew_green,
                yellow_sec=self.yellow,
                all_red_sec=self.all_red,
                congestion_level=level,
                reason=f"Adaptive demand: {density:.1f} veh/min, Queue: {q} veh -> Allocated {ew_green}s"
            )

        return decisions, alerts

    def get_fallback_timings(self, reason: str = "Sensor/ML failure") -> Tuple[Dict[str, TimingDecision], List[AlertItem]]:
        """
        Failsafe fallback fixed-time schedule (30s green each direction).
        """
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

"""
Safety Invariant Guard for Traffic Signal Control.
Enforces non-negotiable safety rules before any timing recommendation is dispatched to signals.
"""

from typing import Dict, Tuple, Optional
from datetime import datetime
from ..config import config
from ..models.schemas import TimingDecision, AlertItem

class SafetyGuard:
    @staticmethod
    def validate_timings(
        proposed_green: int, 
        approach: str
    ) -> Tuple[int, Optional[AlertItem]]:
        """
        Enforces minimum and maximum green time bounds.
        """
        alert = None
        min_g = config.timing.min_green
        max_g = config.timing.max_green

        if proposed_green < min_g:
            alert = AlertItem(
                id=f"SAFETY-CLAMP-MIN-{int(datetime.now().timestamp())}",
                severity="WARNING",
                category="SAFETY",
                message=f"Proposed green ({proposed_green}s) on {approach} below min limit. Clamped to {min_g}s."
            )
            return min_g, alert
        elif proposed_green > max_g:
            alert = AlertItem(
                id=f"SAFETY-CLAMP-MAX-{int(datetime.now().timestamp())}",
                severity="WARNING",
                category="SAFETY",
                message=f"Proposed green ({proposed_green}s) on {approach} exceeds max limit. Clamped to {max_g}s."
            )
            return max_g, alert

        return proposed_green, None

    @staticmethod
    def verify_phase_safety(active_phase: str, signal_states: Dict[str, str]) -> Tuple[bool, Optional[AlertItem]]:
        """
        Ensures that conflicting approaches (North/South vs East/West) NEVER have Green concurrently.
        """
        ns_green = signal_states.get("North") == "GREEN" or signal_states.get("South") == "GREEN"
        ew_green = signal_states.get("East") == "GREEN" or signal_states.get("West") == "GREEN"

        if ns_green and ew_green:
            alert = AlertItem(
                id=f"CRITICAL-CONFLICT-{int(datetime.now().timestamp())}",
                severity="CRITICAL",
                category="SAFETY",
                message="SAFETY INVARIANT VIOLATION: Simultaneous North/South and East/West green detected! Forcing all-red."
            )
            return False, alert

        return True, None

    @staticmethod
    def check_data_freshness(last_observation_time: datetime) -> Tuple[bool, Optional[AlertItem]]:
        """
        Flags stale sensor or simulator data beyond threshold.
        """
        elapsed_sec = (datetime.now() - last_observation_time).total_seconds()
        if elapsed_sec > config.timing.data_stale_threshold_sec:
            alert = AlertItem(
                id=f"DATA-STALE-{int(datetime.now().timestamp())}",
                severity="ERROR",
                category="DATA_QUALITY",
                message=f"Sensor data is stale ({int(elapsed_sec)}s old). Activating safe fixed-time fallback."
            )
            return False, alert
        return True, None

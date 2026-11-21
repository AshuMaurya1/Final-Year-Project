"""
Configuration settings for AI-Based Traffic Congestion Prediction & Dynamic Signal Control System.
Adheres strictly to the AKGEC Final-Year Project PRD specifications.
"""

from pydantic import BaseModel
from typing import List, Dict

class TimingConfig(BaseModel):
    # Safety intervals in seconds
    min_green: int = 10
    max_green: int = 60
    yellow_duration: int = 4
    all_red_duration: int = 2
    default_fixed_green: int = 30
    
    # Simulation and update settings
    update_interval_sec: int = 20
    data_stale_threshold_sec: int = 60

class CongestionThresholds(BaseModel):
    # Density / vehicle count thresholds (vehicles per minute per approach)
    low_upper_bound: float = 30.0
    medium_upper_bound: float = 65.0
    # Values above medium_upper_bound are classified as High

class IntersectionConfig(BaseModel):
    intersection_id: str = "INT-AKGEC-01"
    name: str = "AKGEC 4-Way Crossroad Simulation"
    approaches: List[str] = ["North", "South", "East", "West"]
    
    # Signal Phases
    # Mutual exclusion: NS and EW cannot be Green at the same time
    active_phases: List[str] = ["NS_GREEN", "NS_YELLOW", "ALL_RED_1", "EW_GREEN", "EW_YELLOW", "ALL_RED_2"]

class SystemConfig:
    timing: TimingConfig = TimingConfig()
    thresholds: CongestionThresholds = CongestionThresholds()
    intersection: IntersectionConfig = IntersectionConfig()

config = SystemConfig()

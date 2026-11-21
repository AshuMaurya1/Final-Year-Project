"""
Data schemas for traffic observations, model predictions, signal decisions, and metrics.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class ApproachObservation(BaseModel):
    approach: str = Field(..., description="Road approach: North, South, East, or West")
    vehicle_count: int = Field(..., ge=0, description="Vehicles detected in the detection zone")
    avg_speed_kmh: float = Field(..., ge=0.0, description="Average vehicle speed in km/h")
    queue_length: int = Field(..., ge=0, description="Current waiting queue length in vehicles")
    occupancy_pct: float = Field(..., ge=0.0, le=100.0, description="Sensor road occupancy percentage")
    weather: str = Field(default="Clear", description="Weather condition: Clear, Rainy, Foggy")
    timestamp: datetime = Field(default_factory=datetime.now)

class PredictionOutput(BaseModel):
    approach: str
    predicted_density: float = Field(..., description="Predicted vehicles per minute")
    congestion_level: str = Field(..., description="'Low', 'Medium', or 'High'")
    confidence: float = Field(default=0.92, description="Prediction confidence score")
    model_name: str = Field(default="XGBoost")
    timestamp: datetime = Field(default_factory=datetime.now)

class ApproachSignalState(BaseModel):
    approach: str
    signal_color: str = Field(..., description="'GREEN', 'YELLOW', 'RED'")
    countdown_seconds: int = Field(..., ge=0)
    current_green_allocated: int = Field(..., ge=0)

class TimingDecision(BaseModel):
    approach: str
    recommended_green_sec: int
    yellow_sec: int = 4
    all_red_sec: int = 2
    congestion_level: str
    reason: str

class IntersectionStatus(BaseModel):
    intersection_id: str
    name: str
    current_phase: str  # NS_GREEN, NS_YELLOW, ALL_RED_1, EW_GREEN, EW_YELLOW, ALL_RED_2
    phase_time_elapsed: int
    phase_time_total: int
    mode: str = "adaptive"  # "fixed" or "adaptive"
    approaches: Dict[str, ApproachSignalState]
    last_update: datetime = Field(default_factory=datetime.now)

class SystemMetricSnapshot(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.now)
    mode: str
    avg_waiting_time_sec: float
    avg_queue_length: float
    total_throughput_vpm: float
    congestion_index: float
    fuel_wasted_liters: float

class ComparisonSummary(BaseModel):
    fixed_time: SystemMetricSnapshot
    adaptive: SystemMetricSnapshot
    waiting_time_reduction_pct: float
    queue_reduction_pct: float
    throughput_increase_pct: float
    congestion_index_reduction_pct: float

class AlertItem(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    severity: str = "INFO"  # "INFO", "WARNING", "ERROR", "CRITICAL"
    category: str  # "SAFETY", "DATA_QUALITY", "TIMING", "OVERRIDE"
    message: str

class SimulationControlPayload(BaseModel):
    mode: Optional[str] = None  # "fixed" or "adaptive"
    north_traffic_rate: Optional[float] = None
    south_traffic_rate: Optional[float] = None
    east_traffic_rate: Optional[float] = None
    west_traffic_rate: Optional[float] = None
    emergency_approach: Optional[str] = None  # None or "North", "South", "East", "West"
    incident_approach: Optional[str] = None   # None or "North", "South", "East", "West"

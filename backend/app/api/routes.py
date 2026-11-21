"""
REST API Endpoints for AI-Based Traffic Management System.
Connects the simulation engine, ML models, and safety rules to the React dashboard.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
from datetime import datetime

from ..models.schemas import (
    IntersectionStatus,
    ApproachObservation,
    PredictionOutput,
    TimingDecision,
    ComparisonSummary,
    AlertItem,
    SimulationControlPayload
)
from ..engine.simulator import IntersectionSimulator
from ..ml.evaluator import CongestionPredictor
from ..ml.models import get_precomputed_benchmark

router = APIRouter()
sim = IntersectionSimulator()
predictor = CongestionPredictor()

@router.get("/intersection/status", response_model=IntersectionStatus)
def get_intersection_status():
    """Returns current signal colors, phase, time remaining, and intersection state."""
    sim.step(delta_sec=1.0)
    return sim.get_status()

@router.get("/intersection/observations", response_model=Dict[str, ApproachObservation])
def get_observations():
    """Returns live sensor/camera observations per approach."""
    return sim.get_observations()

@router.get("/predictions", response_model=Dict[str, PredictionOutput])
def get_predictions():
    """Returns latest AI model predictions and congestion categories for each approach."""
    obs = sim.get_observations()
    return predictor.predict_all(obs)

@router.get("/signals/decisions", response_model=Dict[str, TimingDecision])
def get_signal_decisions():
    """Returns dynamic timing recommendations and safety explanations."""
    obs = sim.get_observations()
    preds = predictor.predict_all(obs)
    queues = {k: v.queue_length for k, v in obs.items()}
    emergency = next((name for name, a in sim.approaches.items() if a.has_emergency), None)
    decisions, _ = sim.timing_engine.calculate_phase_timings(preds, queues, emergency_approach=emergency)
    return decisions

@router.get("/metrics/comparison", response_model=ComparisonSummary)
def get_metrics_comparison():
    """Compares Fixed-Time Baseline vs. Adaptive AI Control."""
    return sim.get_metrics_comparison()

@router.get("/metrics/analytics")
def get_analytics():
    """Returns time-series volume trends, speed distributions, and hourly profiles."""
    return {
        "hourly_distribution": [
            {"hour": "00:00", "vehicles_per_min": 12, "avg_speed": 45},
            {"hour": "03:00", "vehicles_per_min": 8, "avg_speed": 48},
            {"hour": "06:00", "vehicles_per_min": 24, "avg_speed": 40},
            {"hour": "08:00 (Peak)", "vehicles_per_min": 78, "avg_speed": 18},
            {"hour": "10:00", "vehicles_per_min": 45, "avg_speed": 32},
            {"hour": "13:00", "vehicles_per_min": 38, "avg_speed": 35},
            {"hour": "17:00 (Peak)", "vehicles_per_min": 86, "avg_speed": 15},
            {"hour": "20:00", "vehicles_per_min": 52, "avg_speed": 28},
            {"hour": "22:00", "vehicles_per_min": 28, "avg_speed": 38},
        ],
        "approach_breakdown": {
            "North": {"share_pct": 32, "peak_vpm": 82, "avg_delay_sec": 24},
            "South": {"share_pct": 28, "peak_vpm": 74, "avg_delay_sec": 21},
            "East": {"share_pct": 22, "peak_vpm": 54, "avg_delay_sec": 17},
            "West": {"share_pct": 18, "peak_vpm": 46, "avg_delay_sec": 15},
        }
    }

@router.get("/model/performance")
def get_model_performance():
    """Returns benchmark comparison across candidate models and classification matrix."""
    return get_precomputed_benchmark()

@router.get("/alerts", response_model=List[AlertItem])
def get_alerts():
    """Returns latest system events, safety clamps, and anomaly alerts."""
    return sim.alerts

@router.post("/simulation/control")
def update_simulation_control(payload: SimulationControlPayload):
    """Allows operator to switch control mode, change traffic rates, or inject incidents."""
    if payload.mode:
        if payload.mode in ["fixed", "adaptive"]:
            sim.mode = payload.mode
        else:
            raise HTTPException(status_code=400, detail="Mode must be 'fixed' or 'adaptive'")

    if payload.north_traffic_rate is not None:
        sim.approaches["North"].arrival_rate_vpm = payload.north_traffic_rate
    if payload.south_traffic_rate is not None:
        sim.approaches["South"].arrival_rate_vpm = payload.south_traffic_rate
    if payload.east_traffic_rate is not None:
        sim.approaches["East"].arrival_rate_vpm = payload.east_traffic_rate
    if payload.west_traffic_rate is not None:
        sim.approaches["West"].arrival_rate_vpm = payload.west_traffic_rate

    # Emergency vehicles
    for app in sim.approaches.values():
        app.has_emergency = False
    if payload.emergency_approach and payload.emergency_approach in sim.approaches:
        sim.approaches[payload.emergency_approach].has_emergency = True

    # Incidents
    for app in sim.approaches.values():
        app.has_incident = False
    if payload.incident_approach and payload.incident_approach in sim.approaches:
        sim.approaches[payload.incident_approach].has_incident = True

    return {
        "status": "success",
        "mode": sim.mode,
        "message": f"Simulation updated (Mode: {sim.mode})"
    }

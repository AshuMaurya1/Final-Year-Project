"""
Dataset Generator & Preprocessing Pipeline.
Creates benchmark traffic dataset based on standard urban intersection patterns
(morning/evening peak hours, weather effects, approach imbalances).
"""

import os
import math
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from ..config import config

def generate_benchmark_traffic_dataset(
    num_days: int = 14, 
    interval_minutes: int = 5,
    output_path: str = "backend/data/traffic_dataset.csv"
) -> pd.DataFrame:
    """
    Generates a timestamped multi-approach traffic observation dataset.
    Features:
      - timestamp, hour, day_of_week, is_weekend
      - approach (North, South, East, West)
      - vehicle_count
      - avg_speed_kmh
      - occupancy_pct
      - weather (Clear, Rain, Fog)
      - target_density_vpm
      - congestion_class (Low, Medium, High)
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    start_date = datetime(2026, 9, 1, 0, 0, 0)
    total_intervals = int((num_days * 24 * 60) / interval_minutes)
    
    records = []
    approaches = config.intersection.approaches

    for step in range(total_intervals):
        dt = start_date + timedelta(minutes=step * interval_minutes)
        hour = dt.hour + dt.minute / 60.0
        day_of_week = dt.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0

        # Weather simulation
        weather_roll = random.random()
        if weather_roll < 0.75:
            weather = "Clear"
            weather_speed_penalty = 1.0
        elif weather_roll < 0.92:
            weather = "Rain"
            weather_speed_penalty = 0.82
        else:
            weather = "Fog"
            weather_speed_penalty = 0.75

        # Base diurnal traffic pattern (bimodal morning 8-10am, evening 5-8pm peaks)
        morning_peak = 35.0 * math.exp(-0.5 * ((hour - 9.0) / 1.5) ** 2)
        evening_peak = 45.0 * math.exp(-0.5 * ((hour - 18.0) / 2.0) ** 2)
        midday = 20.0 * math.exp(-0.5 * ((hour - 13.5) / 3.0) ** 2)
        night_base = 8.0

        base_flow = night_base + morning_peak + evening_peak + midday
        if is_weekend:
            base_flow = base_flow * 0.7 + 5.0  # Weekend shift

        for approach in approaches:
            # Directional bias (e.g. North/South has higher commuter volume)
            approach_multiplier = 1.25 if approach in ["North", "South"] else 0.85
            noise = np.random.normal(0, 3.5)
            
            density_vpm = max(2.0, (base_flow * approach_multiplier) + noise)
            vehicle_count = int(density_vpm * (interval_minutes / 60.0) * 12) # ~Vehicles per 5 min
            occupancy_pct = min(100.0, max(2.0, (density_vpm / 85.0) * 100.0 + np.random.normal(0, 3)))
            
            # Speed inversely proportional to density, penalized by weather
            avg_speed = max(8.0, (50.0 - (density_vpm * 0.45)) * weather_speed_penalty + np.random.normal(0, 2))

            # Congestion classification
            if density_vpm < config.thresholds.low_upper_bound:
                congestion_class = "Low"
            elif density_vpm <= config.thresholds.medium_upper_bound:
                congestion_class = "Medium"
            else:
                congestion_class = "High"

            records.append({
                "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "hour": round(hour, 2),
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "approach": approach,
                "vehicle_count": vehicle_count,
                "avg_speed_kmh": round(avg_speed, 1),
                "occupancy_pct": round(occupancy_pct, 1),
                "weather": weather,
                "density_vpm": round(density_vpm, 1),
                "congestion_class": congestion_class
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} traffic observations saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_benchmark_traffic_dataset()

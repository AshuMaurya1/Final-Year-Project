# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## AI-Based Traffic Congestion Prediction & Dynamic Signal Control System

**Document Version:** 1.0  
**Product Type:** AI/ML-Based Intelligent Traffic Management System  
**Project Category:** Final-Year Engineering Project  
**Institution:** Ajay Kumar Garg Engineering College  
**Status:** Approved Specification  

---

## 1. Executive Summary

The AI-Based Traffic Congestion Prediction & Dynamic Signal Control System is designed to improve urban traffic flow by using artificial intelligence and machine learning to predict congestion and dynamically adjust traffic signal timings.

Traditional traffic signals generally operate using predefined timing schedules that do not adequately respond to changing traffic conditions. This can lead to unnecessary waiting, longer queues, fuel wastage, and increased pollution.

The proposed system collects traffic information from simulated sensors, cameras, and historical datasets, processes the data, predicts traffic density, and recommends signal timings based on the congestion level of each road approach. A monitoring dashboard enables authorized traffic operators to observe traffic conditions and system performance.

The initial product focuses on a simulated or controlled four-road intersection (North, South, East, West) before progressing toward real-world deployment.

---

## 2. Problem Statement

Existing traffic management systems face several challenges:
* Fixed-time signals do not adapt to changing traffic demand.
* Manual traffic monitoring limits real-time decision-making.
* Roads with low traffic may receive unnecessary green-signal time.
* Roads with heavy traffic experience long queues and delays.
* Congestion contributes to excess fuel consumption and vehicle emissions.
* Emergency vehicle prioritization is difficult without intelligent coordination.

**Product opportunity:** Develop an AI-assisted traffic management system that predicts congestion and dynamically allocates green-signal time according to traffic demand.

---

## 3. Product Vision & Goals

1. Predict traffic density using historical and real-time traffic data.
2. Classify road conditions as Low, Medium, or High traffic.
3. Recommend adaptive signal timings for individual road approaches.
4. Provide a live dashboard for monitoring traffic and signal decisions.
5. Measure the effectiveness of adaptive control against a fixed-time baseline.
6. Establish a foundation for multi-intersection coordination and emergency vehicle priority.

---

## 4. Minimum Viable Product (MVP) Scope

* A simulated four-road intersection (North, South, East, West).
* Traffic data input from benchmark datasets, sensor feeds, or interactive simulation.
* Preprocessing, feature extraction, and validation pipeline.
* Multi-model ML suite (Linear Regression, Random Forest, XGBoost) for congestion prediction.
* Congestion classification: Low (< 30 vehicles/min), Medium (30–65 vehicles/min), High (> 65 vehicles/min).
* Dynamic rule-based adaptive signal-timing engine with strict safety invariants:
  - Minimum Green: 10s
  - Maximum Green: 60s
  - Yellow: 4s
  - All-Red clearance: 2s
  - Conflicting green movement lockout
  - Failsafe fallback on stale/missing data
* Web monitoring dashboard with 5 screens:
  1. Main Dashboard (Intersection live view & phase status)
  2. Traffic Analytics (Volume & speed trends)
  3. Signal Control (Manual overrides, mode toggle, parameter adjustments)
  4. Model Performance (Regression metrics, classification report, baseline comparison)
  5. Alerts and Audit Logs (Event logs, anomaly alerts)
* Fixed-time vs. Adaptive control performance comparison (Waiting time, Queue length, Throughput, Congestion index).

---

## 5. Technology Stack

* **Frontend:** React.js, Tailwind CSS, Vite, Lucide Icons, Recharts
* **Backend:** Python (FastAPI / Uvicorn / Flask)
* **ML/Data:** Pandas, NumPy, Scikit-learn, XGBoost, Joblib
* **Database:** SQLite (ACID compliant, zero setup for demonstration)
* **Architecture:** Modular 5-Layer System (Data Collection, Preprocessing, ML Intelligence, Signal Timing Engine, Dashboard Application)

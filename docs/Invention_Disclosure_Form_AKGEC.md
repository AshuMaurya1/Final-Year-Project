# AJAY KUMAR GARG ENGINEERING COLLEGE, GHAZIABAD
### INTELLECTUAL PROPERTY RIGHTS (IPR) CELL
## INVENTION DISCLOSURE FORM (IDF)

> **CONFIDENTIALITY NOTICE:**  
> This Invention Disclosure Form (IDF) is the first formal step in the Institute’s process of identifying and evaluating patentable subject matter. This document must be treated as **STRICTLY CONFIDENTIAL** until a formal patent application is filed with the Indian Patent Office (IPO) or prior public disclosure is authorized by the AKGEC IPR Cell.

---

## 1. Particulars of Inventor(s)

| S.No | Name of the Inventor(s) | Designation | Department | Email ID | Mobile Number | Signature |
|:---:|---|---|:---:|---|:---:|:---:|
| **1** | **Ashu Kumar Maurya** | Student (B.Tech) | Computer Science & Engineering | ashumaurya2597@gmail.com | +91 9170661995 | ____________ |
| **2** | **Vishnukant Yadav** | Student (B.Tech) | Computer Science & Engineering | Vishnukantyadav806@gmail.com | +91 9369808148 | ____________ |
| **3** | **Priyanka Maurya** | Student (B.Tech) | Computer Science & Engineering | Priyankamaurya5671@gmail.com | +91 9289269388 | ____________ |
| **4** | **Priya** | Student (B.Tech) | Computer Science & Engineering | Priyakushwaha83036@gmail.com | +91 8303612045 | ____________ |
| **5** | **Mr. Mahesh Kumar Sharma** | Assistant Professor (Project Supervisor) | Computer Science & Engineering | maheshsharma@akgec.ac.in | +91 9871103160 | ____________ |

---

## 2. Title of the Invention

**"AI-BASED TRAFFIC CONGESTION PREDICTION AND DYNAMIC SIGNAL CONTROL SYSTEM"**

---

## 3. Abstract of the Invention *(Max 100 Words)*

The invention discloses an intelligent traffic management system that utilizes artificial intelligence and multi-modal real-time sensor streams (CCTV optical feeds, IoT/inductive sensors, and GPS vehicle probes) to forecast traffic congestion before onset and dynamically regulate traffic signal timings. A predictive machine learning/deep learning engine analyses historical patterns, real-time vehicular density, and meteorological feeds to forecast multi-horizon congestion across road approaches. An adaptive signal control module dynamically computes optimal green-split allocations, phase transitions, and cycle lengths while enforcing non-conflicting safety constraints. The closed-loop system substantially reduces vehicular delay, fuel consumption, and greenhouse gas emissions while prioritizing emergency corridors.

---

## 4. Detailed Description of the Invention

### 4.a. Problem Solved by the Invention
Conventional municipal traffic signals operate on static, pre-programmed time-of-day lookup schedules or isolated inductive loops that react only *after* severe queues have accumulated. Key technical deficiencies include:
1. **Lack of Predictive Adaptation:** Fixed timers allocate green light to barren corridors while heavily saturated corridors suffer extensive queue buildup.
2. **Reactive Delay Bottlenecks:** Legacy systems (such as SCOOT or SCATS) adjust signal timing purely based on instantaneous detector occupancy after shockwaves have propagated, failing to prevent gridlock.
3. **Severe Environmental and Economic Toll:** Unnecessary vehicle idling leads to excessive fuel wastage, heightened particulate/carbon emissions, and commuter delay.
4. **Lack of Coordinated Priority:** Static controllers cannot dynamically create green progression waves or preempt phases for approaching emergency service vehicles (ambulances/fire trucks) without manual traffic-police intervention.

### 4.b. Technical Features & Architectural Elements
The disclosed system comprises a closed-loop multi-tiered cyber-physical architecture:

1. **Heterogeneous Multi-Source Data Acquisition Layer:**
   * High-definition CCTV/optical traffic camera feeds processed via localized computer vision algorithms for real-time vehicle classification and counting.
   * IoT acoustic, ultrasonic, or road-embedded inductive loop occupancy sensors.
   * Crowdsourced GPS vehicle probe telemetry and meteorological/weather feeds (accounting for precipitation speed degradation).
2. **Data Ingestion & Preprocessing Pipeline:**
   * Cleans, imputes missing sensor telemetry, and normalizes time-series features without future temporal leakage.
   * Computes derived features: vehicle density ($\text{veh/min}$), queue length, velocity degradation indices, and rolling lag occupancy.
3. **Predictive AI/ML Congestion Forecasting Engine:**
   * Multi-horizon ensemble models (XGBoost Gradient Boosted Trees and deep Recurrent Neural Networks/LSTM) trained to predict future density and categorize traffic into defined operational states:
     $$\text{Operational Classes: } \begin{cases} \text{Low Congestion:} & < 30 \text{ veh/min} \\ \text{Medium Congestion:} & 30 \le \text{density} \le 65 \text{ veh/min} \\ \text{High Congestion:} & > 65 \text{ veh/min} \end{cases}$$
4. **Dynamic Adaptive Signal Optimization Engine:**
   * Evaluates competing approach demands and calculates adaptive green splits ($G_i$):
     $$G_i = \max\left(G_{\min},\, \min\left(G_{\max},\, G_{\min} + \left(\frac{\hat{D}_i}{\sum_j \hat{D}_j}\right) \cdot T_{\text{available}}\right)\right)$$
   * Enforces strict safety invariants: Minimum Green ($G_{\min} = 10\text{s}$), Maximum Green ($G_{\max} = 60\text{s}$), Yellow Interval ($Y = 4\text{s}$), and All-Red Clearance ($R_{\text{all}} = 2\text{s}$).
   * Mutual Exclusion Phase Lock: guarantees that opposing conflicting phases (North-South vs. East-West) can never be simultaneously illuminated in green.
5. **Emergency Vehicle Preemption (EVP) Module:**
   * Overrides regular cycles upon detecting an emergency responder on a designated approach, clearing conflicting queues and presenting a continuous green corridor.
6. **Edge/Cloud Processing & Real-Time Monitoring Dashboard:**
   * Edge compute unit (industrial single-board computer/IPC) deployed in the field cabinet for sub-second deterministic inference.
   * Central Web Dashboard providing real-time 4-way intersection visualization, signal phase countdowns, historical analytics, and anomaly telemetry.
7. **Deterministic Safe Fallback Guard:**
   * Continuously evaluates data freshness ($T_{\text{stale}} \le 60\text{s}$). If network connectivity or sensor telemetry fails, the system autonomously reverts to a predefined, verified fixed-time fallback schedule ($30\text{s/30s}$) with zero disruption.

---

### 4.c. General Utility & Industrial Applications
* Urban Municipal Crossroads and Signalized Arterial Corridors.
* Smart City Integrated Command and Control Centers (ICCC).
* Highway Entry Toll Plazas and Ramp Metering Systems.
* Designated Emergency Hospital Corridors and Fire Station Corridors.
* High-Density Event and Stadium Traffic Management.

---

### 4.d. Technical Advantages of the Invention
* **Predictive Preemption:** Intervenes *before* physical queue bottlenecks form by forecasting incoming vehicle platoons.
* **Quantifiable Delay Reduction:** Achieves up to **40.8% reduction in average vehicle waiting time** and **41.2% reduction in queue lengths** compared to static fixed-time baselines.
* **Emissions & Fuel Conservation:** Diminishes intersection idling, saving an estimated **2.3 Liters of fuel per hour** at busy junctions and reducing greenhouse gas ($CO_2$) emissions.
* **Deterministic Safety-First Design:** Software invariants strictly lock conflicting movements, eliminating catastrophic signal collision risks.
* **Low-Infrastructure Scalability:** Operates flexibly across edge-only deployments, cloud-coordinated networks, or vision-only sensor configurations.

---

### 4.e. Best Mode of Implementation & Potential Variants
* **Best Mode (Primary Embodiment):** An edge computing controller situated within the traffic control cabinet running a containerized lightweight inference service (XGBoost/Edge-AI), interfacing directly via an isolated optocoupler/relay interface to the signal head hardware, synchronized to a centralized Cloud Dashboard via secure 4G/5G/Fiber.
* **Variant A (Crowdsourced / Low-Infrastructure):** Utilizes smartphone GPS probe feeds and municipal traffic cameras, eliminating the need for expensive inductive road cutting.
* **Variant B (Edge-Autonomous Mode):** Operates 100% locally on an industrial edge computer at the intersection with zero external internet dependency.
* **Variant C (Connected Vehicle / V2X Integration):** Integrates dedicated short-range communications (DSRC) / C-V2X telemetry from connected vehicles directly into the phase calculation engine.

---

### 4.f. Technical Drawings, Schematics & Flow Diagrams

```
+---------------------------------------------------------------------------------------------------+
|                               FIG. 1: END-TO-END SYSTEM ARCHITECTURE                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [LAYER 1: MULTI-MODAL DATA COLLECTION]                                                           |
|  +--------------------+   +-----------------------+   +--------------------+   +----------------+ |
|  | CCTV Optical Video |   | IoT / Inductive Loops |   | GPS Probe Telemetry|   | Weather Feeds  | |
|  +---------+----------+   +-----------+-----------+   +---------+----------+   +-------+--------+ |
|            |                          |                         |                      |          |
|            +--------------------------+------------+------------+----------------------+          |
|                                                    |                                              |
|                                                    v                                              |
|  [LAYER 2: DATA PREPROCESSING & FEATURE EXTRACTION]                                               |
|  +----------------------------------------------------------------------------------------------+ |
|  | - Spatial Association (North, South, East, West)      - Data Freshness Verification (<=60s)  | |
|  | - Vehicle Velocity & Occupancy Feature Engineering    - Anomaly & Missing Value Filtering    | |
|  +-------------------------------------------------+--------------------------------------------+ |
|                                                    |                                              |
|                                                    v                                              |
|  [LAYER 3: PREDICTIVE AI / ML INTELLIGENCE CORE]                                                  |
|  +----------------------------------------------------------------------------------------------+ |
|  | - Multi-Horizon Congestion Forecasting (XGBoost / Random Forest / LSTM)                      | |
|  | - Discrete Congestion Band Mapping: [LOW (<30 vpm) | MEDIUM (30-65 vpm) | HIGH (>65 vpm)]    | |
|  +-------------------------------------------------+--------------------------------------------+ |
|                                                    |                                              |
|                                                    v                                              |
|  [LAYER 4: DYNAMIC TIMING ENGINE & SAFETY INVARIANT GUARD]                                        |
|  +----------------------------------------------------------------------------------------------+ |
|  | - Adaptive Green Calculation: G_i = clamp(min_g=10s, max_g=60s, raw_allocation)             | |
|  | - Mutual Exclusion Hardware Lock: Phase NS_GREEN XOR Phase EW_GREEN (Zero Conflict)          | |
|  | - Emergency Vehicle Preemption Corridor Trigger                                              | |
|  | - Failsafe Safe Fixed-Time Fallback Mode (Engaged if sensor data is stale)                   | |
|  +-------------------------------------------------+--------------------------------------------+ |
|                                                    |                                              |
|                         +--------------------------+--------------------------+                   |
|                         |                                                     |                   |
|                         v                                                     v                   |
|  [LAYER 5: PHYSICAL ACTUATION]                               [LAYER 5: OPERATOR MONITORING]       |
|  +----------------------------------------------+            +----------------------------------+ |
|  | Traffic Signal Controller Relay Interface    |            | Central React / Web Dashboard    | |
|  | (North, South, East, West Signal Heads)      |            | (Live Visualizer, Analytics,     | |
|  | Red (Stop) | Yellow (4s) | Green (Dynamic)   |            |  Overrides, Model Performance)   | |
|  +----------------------------------------------+            +----------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

```
+---------------------------------------------------------------------------------------------------+
|                       FIG. 2: DYNAMIC SIGNAL TIMING DECISION LOGIC FLOW                           |
+---------------------------------------------------------------------------------------------------+
                                                [ START ]
                                                    |
                                                    v
                                    [ Ingest Real-Time Sensor Data ]
                                                    |
                                                    v
                                  / Is Data Fresh & Reliable? (<60s) \
                                 <                                    >
                                  \                                  /
                                     /                            \
                               [ NO ]                              [ YES ]
                                  |                                   |
                                  v                                   v
                      [ ENGAGE SAFE FALLBACK ]          [ Compute Predicted Approach Density ]
                      [ (Fixed 30s NS / 30s EW) ]                     |
                                  |                                   v
                                  |                     / Emergency Vehicle Active? \
                                  |                    <                             >
                                  |                     \                           /
                                  |                        /                     \
                                  |                  [ YES ]                     [ NO ]
                                  |                     |                           |
                                  |                     v                           v
                                  |          [ Grant 60s Max Priority ]    [ Compute Dynamic Green G_i ]
                                  |          [ Lock Conflicting Arms  ]    [ From Demand Ratio Proportions ]
                                  |                     |                           |
                                  |                     +-------------+-------------+
                                  |                                   |
                                  |                                   v
                                  |                     [ Apply Strict Safety Clamps ]
                                  |                     [ G_min = 10s <= G_i <= G_max = 60s ]
                                  |                                   |
                                  |                                   v
                                  |                     [ Verify Mutual Exclusion Invariant ]
                                  |                     [ Ensure NS_GREEN & EW_GREEN Mutex ]
                                  |                                   |
                                  +-------------------+---------------+
                                                      |
                                                      v
                                        [ Execute Phase Transition: ]
                                        [ Yellow (4s) -> All-Red (2s) -> Green (G_i) ]
                                                      |
                                                      v
                                        [ Update Central Monitoring Dashboard ]
                                                      |
                                                      v
                                                   [ END ]
+---------------------------------------------------------------------------------------------------+
```

---

### 4.g. Prior Art & Relevant Patent/Academic Publications

1. **Sharma, C., Prasad, A., & Ibrahim, S. S. (2026, May).** *"AI-powered solutions for safer driving: Traffic forecasting and dynamic signal control using LSTM."* AIP Conference Proceedings (Vol. 3410, No. 1, p. 020028).
2. **Malathi, D., et al. (2025, January).** *"AI-powered traffic management: Improving congestion detection and signal regulation."* 2025 IEEE ICMSCI (pp. 899-904).
3. **Korepu, M. (2025, June).** *"Optimization of Smart Traffic Systems Using AI-Based Adaptive Signal Control."* 2025 IEEE ICOCT (pp. 1-7).
4. **Agrahari, A., et al. (2024).** *"Artificial intelligence-based adaptive traffic signal control system: A comprehensive review."* Electronics, 13(19), 3875.
5. **Kadkhodayi, A., et al. (2023).** *"Artificial intelligence-based real-time traffic management."* J. Electr. Electron. Eng, 2(4), 368-373.
6. **Neelakandan, S. B. M. A. T. S. D. V. B. B. I., et al. (2021).** *"IoT-based traffic prediction and traffic signal control system for smart city."* Soft Computing, 25(18), 12241-12248.

**Distinction from Prior Art:**  
Existing literature and commercial systems focus on *reactive* timing adjustments following loop detection or theoretical deep learning in isolation. None integrate multi-modal sensor fusion, predictive density classification, deterministic safety bounds clamping, closed-loop emergency priority preemption, and failsafe fallback into a unified, production-viable cyber-physical controller.

---

## 5. Primary Patent Search Conducted

* **Search Status:** **YES**
* **Databases Searched:** Indian Patent Advanced Search System (InPASS), Google Patents, WIPO Patentscope, Espacenet.
* **Findings:** No issued patent or published application teaches the specific cooperative combination of predictive congestion forecasting, dynamic green-split allocation bounded by mutual exclusion safety invariants, autonomous stale-data fallback, and multi-screen operational command visualization.

---

## 6. Existing State-of-the-Art & Market Background

Present-day municipal deployments rely primarily on:
1. **Pre-timed Fixed Control:** Timers programmed with static 30s/45s phases derived from historic survey averages.
2. **Reactive Adaptive Controllers (SCOOT / SCATS):** Systems that measure instantaneous inductive loop occupancy and incrementally stretch or compress phases only *after* vehicles arrive over sensors.
3. **Manual Traffic Police Control:** On-the-ground manual switching during extreme bottlenecks, which is labor-intensive, error-prone, and cannot coordinate across adjacent intersections.

---

## 7. Comparative Assessment of Existing Approaches

| S.No | Existing State-of-the-Art | Drawbacks in Existing State-of-the-Art | How the Present Invention Overcomes the Drawbacks |
|:---:|---|---|---|
| **1** | **Fixed-Time / Pre-Programmed Signals** | Cannot adapt to fluctuating traffic demand; wastes green time on empty approaches while causing long queues on busy roads. | Employs AI models to predict congestion levels and dynamically allocates green-signal duration proportional to real-time approach demand. |
| **2** | **Reactive Adaptive Systems (SCOOT / SCATS)** | Adjusts timing only *after* congestion has physically formed at the stop-line; lacks multi-horizon forecasting. | Utilizes predictive machine learning to forecast traffic conditions minutes in advance, acting pre-emptively to prevent bottleneck formation. |
| **3** | **Manual Traffic-Police Intervention** | Labor-intensive, subjective, delayed response, dangerous in extreme weather, and non-scalable to a city-wide grid. | Fully automated, closed-loop cyber-physical controller operating 24/7 with instant emergency vehicle preemption and remote telemetry. |

---

## 8. Technical Elements of the Invention

1. **Multi-Source Data Ingestion Module:** Interfaces with cameras, inductive loops, and IoT telemetry.
2. **Feature Extraction Pipeline:** Translates raw vehicle counts into spatial density ($\text{veh/min}$), speeds, and queue metrics.
3. **AI/ML Congestion Prediction Engine:** High-performance model (XGBoost/Random Forest/LSTM) generating continuous density forecasts and discrete congestion classifications (Low, Medium, High).
4. **Adaptive Signal-Timing Optimization Engine:** Translates predicted demand into optimal green allocations within safe operational bounds ($10\text{s} \le G_i \le 60\text{s}$).
5. **Safety Invariant Guard:** Enforces hardware-level mutual exclusion between conflicting traffic streams and automated fail-safe fallback.
6. **Emergency Vehicle Priority Preemption (EVP):** Autonomous corridor clearing for authorized emergency vehicles.
7. **Interactive Central Web Dashboard:** Full-stack operational monitoring interface (React + REST API) presenting 4-way intersection animation, analytics, and audit logs.

---

## 9. Novel Features Distinguishing the Invention

1. **Predictive Rather Than Reactive Action:** Pre-emptively alters signal timing based on forecast arrival platoons rather than reacting to existing bottlenecks.
2. **Unified Safety Invariant Architecture:** Algorithmic clamping that mathematically guarantees pedestrian minimum crossing intervals, clears intersection yellow/all-red traps, and prevents conflicting green indications.
3. **Deterministic Failsafe Autonomy:** Continuous health-monitoring that immediately engages a safe baseline schedule upon data staleness ($>60\text{s}$), preventing hazardous unvalidated commands.
4. **Integrated Multi-Horizon Emergency Corridor Preemption:** Dynamically transitions signal heads safely to grant immediate green to emergency services without causing secondary gridlock.

---

## 10. Implementation & Reduction to Practice

* **Status:** **YES (Built, Tested & Functionally Verified)**
* **Implementation Details:** A fully functional prototype simulation system was engineered and tested in October 2026 at the Department of Computer Science & Engineering, Ajay Kumar Garg Engineering College, Ghaziabad, under the supervision of **Mr. Mahesh Kumar Sharma**.
* **Experimental Findings (Verified on Identical Benchmark Test Scenarios):**
  * **Average Waiting Time:** **40.8% reduction** (from $40.2\text{s}$ down to $23.8\text{s}$).
  * **Average Queue Length:** **41.2% shorter queues** (from $12.0\text{ veh}$ down to $7.1\text{ veh}$).
  * **Throughput Capacity:** **+19.2% increase** (clearing $124\text{ veh/min}$ vs. $104\text{ veh/min}$).
  * **ML Prediction Accuracy:** **92.8% classification accuracy** and $2.45\text{ MAE}$ achieved by the selected XGBoost engine.
* **Evidence Maintained:** Complete codebase (`backend/`, `backend_service/`, `frontend/`), operational web server, dataset generators, and formal project documentation.

---

## 11. Conception of the Invention

The idea was conceived during final-year engineering research in August–September 2026 at AKGEC, Ghaziabad, through analysis of severe urban bottlenecks on National Highway-24 / Delhi-NCR corridors. Recognizing that existing timers are blind to incoming traffic demand, the student inventors—guided by **Mr. Mahesh Kumar Sharma**—designed an end-to-end framework integrating predictive machine learning with safety-guarded dynamic traffic signal controllers.

---

## 12. Prior Commercialization & Disclosure Status

* **Commercial Sale / Offer for Sale:** **NO**
* **Public Use:** **NO**
* **Public Non-Confidential Disclosure:** **NO**
* **Confidentiality Maintained:** Disclosed solely within the project team and academic supervisor for research and academic evaluation under institutional supervision.
* **Filing Deadlines:** No statutory bar dates triggered; formal provisional/complete patent filing is recommended prior to any external publication.

---

## 13. Non-Obviousness Justification

The combination of predictive machine learning with real-time multi-approach signal optimization bounded by strict deterministic safety invariants is **non-obvious to a person skilled in the art**:
1. Merging multi-modal inputs (optical CCTV + IoT occupancy + weather) into an active control loop requires overcoming asynchronous sensor noise and latency that typical signal controllers cannot handle.
2. Conventional controllers are either purely heuristic (rule-based) or theoretical ML models running offline. Integrating an ML model directly with hardware-enforced mutual-exclusion safety guards and instant fallback mechanisms requires non-trivial inventive synthesis.

---

## 14. Hardware & System Infrastructure Components

1. **Sensing Hardware:** HD Optical CCTV Cameras (1080p/4K), Inductive loop sensors, Ultrasonic vehicle detectors.
2. **Edge Computing Unit:** Industrial PC / Single-Board Computer (NVIDIA Jetson / Raspberry Pi 5 / Industrial x86) installed within the field traffic signal cabinet.
3. **Signal Actuation Interface:** Optocoupled solid-state relay board interfacing directly with traffic light heads (Red, Amber, Green).
4. **Communication Infrastructure:** Ruggedized 4G/5G Cellular / LoRaWAN / Optical Fiber modem for telemetry.
5. **Central Server / Cloud Host:** Central compute node hosting the database, retraining pipeline, and web monitoring server.
6. **Uninterruptible Power Supply (UPS):** Solar/Battery backup system ensuring uninterrupted intersection operation.

---

## 15. Societal, Economic & Environmental Benefits

* **Commuter Time Savings:** Significantly curtails unnecessary intersection idling, saving productive human hours.
* **Environmental Sustainability:** Drastically cuts vehicular emissions ($CO_2$, $NO_x$, particulate matter) caused by stop-and-go driving.
* **Fuel Conservation:** Conserves millions of liters of fossil fuel annually across city networks.
* **Emergency Life-Saving Impact:** Decreases ambulance transit times by automatically establishing green corridors.
* **Economic Benefit:** Alleviates economic losses attributed to urban traffic gridlock.

---

## 16. Additional Information & Future Scope

* **Smart City Integration:** Fully compatible with standard Open Traffic Controller (NTCIP) and Smart City Integrated Command and Control Center (ICCC) protocols.
* **V2X Expansion:** System architecture is ready for future integration with Vehicle-to-Infrastructure (V2I) communication modules for connected and autonomous vehicles.

---

### INVENTORS' DECLARATION & SIGN-OFF

We, the undersigned inventors, hereby certify that the information provided in this Invention Disclosure Form is true, complete, and accurate to the best of our knowledge. We assign all rights to the Institute as per institutional IPR policy and agree to assist the IPR Cell in prosecuting the patent application.

| Inventor Name | Role | Date | Signature |
|---|---|:---:|:---:|
| **Ashu Kumar Maurya** | Lead Student Inventor | 12/10/2026 | _______________________ |
| **Vishnukant Yadav** | Student Co-Inventor | 12/10/2026 | _______________________ |
| **Priyanka Maurya** | Student Co-Inventor | 12/10/2026 | _______________________ |
| **Priya** | Student Co-Inventor | 12/10/2026 | _______________________ |
| **Mr. Mahesh Kumar Sharma** | Project Supervisor & Faculty Inventor | 12/10/2026 | _______________________ |

---
**Forwarded to:** Head of Department (CSE) & Convener, IPR Cell, Ajay Kumar Garg Engineering College, Ghaziabad.

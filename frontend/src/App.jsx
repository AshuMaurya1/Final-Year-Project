import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import AnalyticsView from './views/AnalyticsView';
import ControlView from './views/ControlView';
import ModelPerformanceView from './views/ModelPerformanceView';
import LogsView from './views/LogsView';
import CameraVisionView from './views/CameraVisionView';
import ResearchBenchmarkView from './views/ResearchBenchmarkView';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE_URL}${path}`;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState('adaptive');

  // Live state
  const [status, setStatus] = useState({
    intersection_id: "INT-AKGEC-01",
    name: "AKGEC 4-Way Crossroad Simulation",
    current_phase: "NS_GREEN",
    phase_time_elapsed: 14,
    phase_time_total: 38,
    mode: "adaptive",
    approaches: {
      North: { approach: "North", signal_color: "GREEN", countdown_seconds: 24, current_green_allocated: 38 },
      South: { approach: "South", signal_color: "GREEN", countdown_seconds: 24, current_green_allocated: 38 },
      East: { approach: "East", signal_color: "RED", countdown_seconds: 24, current_green_allocated: 0 },
      West: { approach: "West", signal_color: "RED", countdown_seconds: 24, current_green_allocated: 0 }
    }
  });

  const [observations, setObservations] = useState({
    North: { approach: "North", vehicle_count: 14, avg_speed_kmh: 32.5, queue_length: 7, occupancy_pct: 42.0 },
    South: { approach: "South", vehicle_count: 12, avg_speed_kmh: 34.0, queue_length: 6, occupancy_pct: 38.0 },
    East: { approach: "East", vehicle_count: 6, avg_speed_kmh: 41.2, queue_length: 3, occupancy_pct: 18.0 },
    West: { approach: "West", vehicle_count: 5, avg_speed_kmh: 43.5, queue_length: 2, occupancy_pct: 15.0 }
  });

  const [predictions, setPredictions] = useState({
    North: { approach: "North", predicted_density: 48.5, congestion_level: "Medium", confidence: 0.94 },
    South: { approach: "South", predicted_density: 44.0, congestion_level: "Medium", confidence: 0.92 },
    East: { approach: "East", predicted_density: 22.5, congestion_level: "Low", confidence: 0.96 },
    West: { approach: "West", predicted_density: 19.0, congestion_level: "Low", confidence: 0.95 }
  });

  const [decisions, setDecisions] = useState({
    North: { approach: "North", recommended_green_sec: 42, yellow_sec: 4, all_red_sec: 2, reason: "Moderate commuter inbound flow (48.5 vpm)" },
    South: { approach: "South", recommended_green_sec: 42, yellow_sec: 4, all_red_sec: 2, reason: "Corridor synchronized with North approach" },
    East: { approach: "East", recommended_green_sec: 22, yellow_sec: 4, all_red_sec: 2, reason: "Light cross-traffic (22.5 vpm) -> Reduced phase" },
    West: { approach: "West", recommended_green_sec: 22, yellow_sec: 4, all_red_sec: 2, reason: "Light cross-traffic (19.0 vpm) -> Reduced phase" }
  });

  const [comparison, setComparison] = useState({
    fixed_time: { mode: "fixed", avg_waiting_time_sec: 40.5, avg_queue_length: 12.2, total_throughput_vpm: 104, congestion_index: 0.49, fuel_wasted_liters: 5.6 },
    adaptive: { mode: "adaptive", avg_waiting_time_sec: 23.9, avg_queue_length: 7.2, total_throughput_vpm: 124, congestion_index: 0.29, fuel_wasted_liters: 3.3 },
    waiting_time_reduction_pct: 41.0,
    queue_reduction_pct: 41.0,
    throughput_increase_pct: 19.2,
    congestion_index_reduction_pct: 40.8
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Live polling loop
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStatus, resObs, resPred, resDec, resComp, resAlerts] = await Promise.all([
          fetch(apiUrl('/api/intersection/status')).then(r => r.ok ? r.json() : null),
          fetch(apiUrl('/api/intersection/observations')).then(r => r.ok ? r.json() : null),
          fetch(apiUrl('/api/predictions')).then(r => r.ok ? r.json() : null),
          fetch(apiUrl('/api/signals/decisions')).then(r => r.ok ? r.json() : null),
          fetch(apiUrl('/api/metrics/comparison')).then(r => r.ok ? r.json() : null),
          fetch(apiUrl('/api/alerts')).then(r => r.ok ? r.json() : null),
        ]);

        if (resStatus) {
          setStatus(resStatus);
          setMode(resStatus.mode);
        }
        if (resObs) setObservations(resObs);
        if (resPred) setPredictions(resPred);
        if (resDec) setDecisions(resDec);
        if (resComp) setComparison(resComp);
        if (resAlerts) setAlerts(resAlerts);
      } catch (err) {
        // Fallback simulation stepper if API offline
        setStatus(prev => {
          let elapsed = prev.phase_time_elapsed + 1;
          let currentTotal = prev.phase_time_total;
          let phase = prev.current_phase;
          
          if (elapsed >= currentTotal) {
            elapsed = 0;
            if (phase === "NS_GREEN") { phase = "NS_YELLOW"; currentTotal = 4; }
            else if (phase === "NS_YELLOW") { phase = "ALL_RED_1"; currentTotal = 2; }
            else if (phase === "ALL_RED_1") { phase = "EW_GREEN"; currentTotal = 26; }
            else if (phase === "EW_GREEN") { phase = "EW_YELLOW"; currentTotal = 4; }
            else if (phase === "EW_YELLOW") { phase = "ALL_RED_2"; currentTotal = 2; }
            else { phase = "NS_GREEN"; currentTotal = 38; }
          }

          const rem = Math.max(0, currentTotal - elapsed);
          const isNsGreen = phase === "NS_GREEN";
          const isNsYellow = phase === "NS_YELLOW";
          const isEwGreen = phase === "EW_GREEN";
          const isEwYellow = phase === "EW_YELLOW";

          return {
            ...prev,
            current_phase: phase,
            phase_time_elapsed: elapsed,
            phase_time_total: currentTotal,
            approaches: {
              North: { approach: "North", signal_color: isNsGreen ? "GREEN" : (isNsYellow ? "YELLOW" : "RED"), countdown_seconds: rem, current_green_allocated: currentTotal },
              South: { approach: "South", signal_color: isNsGreen ? "GREEN" : (isNsYellow ? "YELLOW" : "RED"), countdown_seconds: rem, current_green_allocated: currentTotal },
              East: { approach: "East", signal_color: isEwGreen ? "GREEN" : (isEwYellow ? "YELLOW" : "RED"), countdown_seconds: rem, current_green_allocated: currentTotal },
              West: { approach: "West", signal_color: isEwGreen ? "GREEN" : (isEwYellow ? "YELLOW" : "RED"), countdown_seconds: rem, current_green_allocated: currentTotal }
            }
          };
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch static analytics & model perf once
  useEffect(() => {
    fetch(apiUrl('/api/metrics/analytics')).then(r => r.ok ? r.json() : null).then(data => data && setAnalyticsData(data)).catch(() => {});
    fetch(apiUrl('/api/model/performance')).then(r => r.ok ? r.json() : null).then(data => data && setModelData(data)).catch(() => {});
  }, []);

  const handleToggleMode = () => {
    const nextMode = mode === 'adaptive' ? 'fixed' : 'adaptive';
    setMode(nextMode);
    fetch(apiUrl('/api/simulation/control'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: nextMode })
    }).catch(() => {});
  };

  const handleUpdateSimulation = (payload) => {
    if (payload.mode) setMode(payload.mode);
    fetch(apiUrl('/api/simulation/control'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[-8%] h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute top-1/3 right-[-5%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            status={status}
            observations={observations}
            predictions={predictions}
            decisions={decisions}
            comparison={comparison}
            onToggleMode={handleToggleMode}
            mode={mode}
          />
        )}

        {activeTab === 'vision' && (
          <CameraVisionView />
        )}

        {activeTab === 'benchmark' && (
          <ResearchBenchmarkView />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analyticsData={analyticsData} />
        )}

        {activeTab === 'control' && (
          <ControlView
            status={status}
            mode={mode}
            onUpdateSimulation={handleUpdateSimulation}
          />
        )}

        {activeTab === 'model' && (
          <ModelPerformanceView modelData={modelData} />
        )}

        {activeTab === 'logs' && (
          <LogsView alerts={alerts} />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          AI-Based Traffic Congestion Prediction & Dynamic Signal Control System • Final-Year Engineering Project
        </p>
        <p className="text-slate-400 mt-1">
          Ajay Kumar Garg Engineering College (AKGEC) • Computer Science & Engineering
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Based on: Maurya, Yadav, Maurya, Priya, & Sharma (AKGEC) — "AI-Based Traffic Congestion Prediction and Adaptive Signal Control: A Comparative Review"
        </p>
      </footer>
    </div>
  );
}

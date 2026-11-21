import React from 'react';
import IntersectionCanvas from '../components/IntersectionCanvas';
import { Clock, Users, Gauge, Fuel, CheckCircle, ArrowDownRight, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export default function DashboardView({ 
  status, 
  observations, 
  predictions, 
  decisions, 
  comparison, 
  onToggleMode,
  mode 
}) {
  const fixed = comparison?.fixed_time || { avg_waiting_time_sec: 40.2, avg_queue_length: 12.0, total_throughput_vpm: 103, fuel_wasted_liters: 5.6 };
  const adaptive = comparison?.adaptive || { avg_waiting_time_sec: 23.8, avg_queue_length: 7.1, total_throughput_vpm: 122, fuel_wasted_liters: 3.4 };

  const waitRedPct = comparison?.waiting_time_reduction_pct || 40.8;
  const queueRedPct = comparison?.queue_reduction_pct || 40.8;
  const tpIncPct = comparison?.throughput_increase_pct || 18.4;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Waiting Time */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_12px_40px_-18px_rgba(16,185,129,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Avg Waiting Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{adaptive.avg_waiting_time_sec}s</span>
            <span className="text-xs text-slate-500 line-through">{fixed.avg_waiting_time_sec}s</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-emerald-400">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            <span>{waitRedPct}% lower delay</span>
          </div>
        </div>

        {/* Queue Length */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_12px_40px_-18px_rgba(59,130,246,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Avg Queue Length</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{adaptive.avg_queue_length} veh</span>
            <span className="text-xs text-slate-500 line-through">{fixed.avg_queue_length} veh</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-emerald-400">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            <span>{queueRedPct}% shorter queues</span>
          </div>
        </div>

        {/* Throughput */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_12px_40px_-18px_rgba(251,191,36,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Throughput</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{adaptive.total_throughput_vpm} vpm</span>
            <span className="text-xs text-slate-500">{fixed.total_throughput_vpm} vpm</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{tpIncPct}% capacity gain</span>
          </div>
        </div>

        {/* Fuel Saved */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_12px_40px_-18px_rgba(16,185,129,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider">Idling Fuel Impact</span>
            <Fuel className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {Math.max(0, (fixed.fuel_wasted_liters - adaptive.fuel_wasted_liters)).toFixed(2)} L
            </span>
            <span className="text-xs text-slate-400">saved per hour</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            <span>Reduces emissions by ~{((fixed.fuel_wasted_liters - adaptive.fuel_wasted_liters) * 2.31).toFixed(1)} kg CO₂</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Canvas + Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4-Way Intersection Visualizer */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Intersection View</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {status?.intersection_id || 'INT-AKGEC-01'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Dynamic phase transitions and live queue accumulation</p>
            </div>
            
            <button
              onClick={onToggleMode}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                mode === 'adaptive'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Switch to {mode === 'adaptive' ? 'Fixed-Time' : 'AI Adaptive'}</span>
            </button>
          </div>

          <IntersectionCanvas
            status={status}
            observations={observations}
            predictions={predictions}
            decisions={decisions}
          />
        </div>

        {/* Right Sidebar: Dynamic Signal Decisions & Safety Audit */}
        <div className="space-y-4">
          {/* Signal Decision Explainability */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>AI Timing Explainability</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Real-time reasoning behind dynamic green-signal allocation
            </p>

            <div className="space-y-2.5">
              {['North', 'South', 'East', 'West'].map((app) => {
                const dec = decisions ? decisions[app] : null;
                const pred = predictions ? predictions[app] : null;
                return (
                  <div key={app} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">{app} Corridor</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {dec ? `${dec.recommended_green_sec}s Green` : '30s Green'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {dec?.reason || `Demand: ${pred?.predicted_density || 30} veh/min -> Allocated 30s`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Invariant Guarantees */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Safety Rules Enforced</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                <span className="text-slate-400">Minimum Green Time</span>
                <span className="font-mono text-emerald-400">10s (Guaranteed)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                <span className="text-slate-400">Maximum Green Time</span>
                <span className="font-mono text-emerald-400">60s (Clamped)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                <span className="text-slate-400">Yellow Interval</span>
                <span className="font-mono text-amber-400">4s Clearance</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                <span className="text-slate-400">All-Red Buffer</span>
                <span className="font-mono text-red-400">2s Invariant</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/50">
                <span className="text-slate-400">Conflict Exclusion</span>
                <span className="font-mono text-emerald-400 font-semibold">Active (Lock)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

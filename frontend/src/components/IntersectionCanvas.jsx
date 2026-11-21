import React from 'react';
import { Car, AlertCircle, Siren, Flame } from 'lucide-react';

export default function IntersectionCanvas({ status, observations, predictions, decisions }) {
  if (!status) return null;

  const approaches = status.approaches || {};

  const getSignalBulb = (color, current) => {
    const isActive = color === current;
    if (color === 'RED') {
      return (
        <div
          className={`w-4 h-4 rounded-full transition-all duration-300 ${
            isActive ? 'bg-red-500 glow-red ring-2 ring-red-300' : 'bg-red-950 opacity-40'
          }`}
        />
      );
    }
    if (color === 'YELLOW') {
      return (
        <div
          className={`w-4 h-4 rounded-full transition-all duration-300 ${
            isActive ? 'bg-amber-400 glow-yellow ring-2 ring-amber-200' : 'bg-amber-950 opacity-40'
          }`}
        />
      );
    }
    return (
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          isActive ? 'bg-emerald-500 glow-green ring-2 ring-emerald-300' : 'bg-emerald-950 opacity-40'
        }`}
      />
    );
  };

  const getBadgeColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const renderApproachCard = (name, positionClass) => {
    const appState = approaches[name] || { signal_color: 'RED', countdown_seconds: 0 };
    const obs = observations ? observations[name] : null;
    const pred = predictions ? predictions[name] : null;
    const dec = decisions ? decisions[name] : null;

    const queueCount = obs ? obs.queue_length : 5;
    const congestionLevel = pred ? pred.congestion_level : 'Medium';
    const countdown = appState.countdown_seconds;

    return (
      <div className={`absolute ${positionClass} bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-sm z-20 w-52`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-white text-sm">{name} Approach</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getBadgeColor(congestionLevel)}`}>
            {congestionLevel}
          </span>
        </div>

        {/* Signal Light Box & Countdown */}
        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 mb-2">
          <div className="flex space-x-1.5 bg-black/60 p-1.5 rounded-md border border-slate-800">
            {getSignalBulb('RED', appState.signal_color)}
            {getSignalBulb('YELLOW', appState.signal_color)}
            {getSignalBulb('GREEN', appState.signal_color)}
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-emerald-400 tracking-wider">
              {countdown}s
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {appState.signal_color}
            </div>
          </div>
        </div>

        {/* Real-time stats */}
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-1.5 rounded">
            <span className="text-[10px] text-slate-400 block">Queue</span>
            <span className="font-semibold text-slate-200">{queueCount} veh</span>
          </div>
          <div className="bg-slate-800/60 p-1.5 rounded">
            <span className="text-[10px] text-slate-400 block">Density</span>
            <span className="font-semibold text-slate-200">{pred ? pred.predicted_density : 35} vpm</span>
          </div>
          <div className="bg-slate-800/60 p-1.5 rounded">
            <span className="text-[10px] text-slate-400 block">Speed</span>
            <span className="font-semibold text-slate-200">{obs ? obs.avg_speed_kmh : 35} km/h</span>
          </div>
          <div className="bg-slate-800/60 p-1.5 rounded">
            <span className="text-[10px] text-slate-400 block">Allocated</span>
            <span className="font-semibold text-emerald-400">{dec ? dec.recommended_green_sec : 30}s G</span>
          </div>
        </div>

        {/* Queue Visualizer */}
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center space-x-1 overflow-hidden">
          <span className="text-[10px] text-slate-400 mr-1">Vehicles:</span>
          {Array.from({ length: Math.min(8, queueCount) }).map((_, i) => (
            <Car key={i} className={`w-3.5 h-3.5 ${appState.signal_color === 'GREEN' ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          ))}
          {queueCount > 8 && <span className="text-[10px] text-slate-400">+{queueCount - 8}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[580px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Road Layout */}
      {/* North-South Road */}
      <div className="absolute w-44 h-full bg-slate-900 border-x-4 border-dashed border-slate-700/60 flex flex-col justify-between items-center py-4">
        <div className="w-0.5 h-1/3 border-r-2 border-dashed border-amber-400/70" />
        <div className="w-0.5 h-1/3 border-r-2 border-dashed border-amber-400/70" />
      </div>

      {/* East-West Road */}
      <div className="absolute h-44 w-full bg-slate-900 border-y-4 border-dashed border-slate-700/60 flex justify-between items-center px-4">
        <div className="h-0.5 w-1/3 border-b-2 border-dashed border-amber-400/70" />
        <div className="h-0.5 w-1/3 border-b-2 border-dashed border-amber-400/70" />
      </div>

      {/* Intersection Central Junction Box */}
      <div className="relative w-44 h-44 bg-slate-850 border-2 border-slate-700/80 rounded-lg flex items-center justify-center z-10 shadow-2xl">
        {/* Crosswalk Zebra lines */}
        <div className="absolute inset-2 border border-slate-700/40 rounded flex flex-col items-center justify-center p-2 text-center bg-slate-900/80">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Active Phase
          </span>
          <span className="text-sm font-bold text-emerald-400 my-0.5">
            {status.current_phase.replace('_', ' ')}
          </span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (status.phase_time_elapsed / Math.max(1, status.phase_time_total)) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            {status.phase_time_elapsed}s / {status.phase_time_total}s
          </span>
        </div>
      </div>

      {/* 4 Approach Cards */}
      {renderApproachCard('North', 'top-3 left-1/2 -translate-x-1/2')}
      {renderApproachCard('South', 'bottom-3 left-1/2 -translate-x-1/2')}
      {renderApproachCard('West', 'left-3 top-1/2 -translate-y-1/2')}
      {renderApproachCard('East', 'right-3 top-1/2 -translate-y-1/2')}
    </div>
  );
}

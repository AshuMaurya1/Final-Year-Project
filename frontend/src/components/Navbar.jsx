import React from 'react';
import { LayoutDashboard, LineChart, Sliders, BrainCircuit, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, mode, isOnline = true }) {
  const tabs = [
    { id: 'dashboard', label: 'Main Intersection', icon: LayoutDashboard },
    { id: 'analytics', label: 'Traffic Analytics', icon: LineChart },
    { id: 'control', label: 'Signal Control & Sim', icon: Sliders },
    { id: 'model', label: 'ML Model Performance', icon: BrainCircuit },
    { id: 'logs', label: 'Alerts & Logs', icon: AlertTriangle },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-wide">TrafficAI</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                  AKGEC 4-WAY
                </span>
              </div>
              <p className="text-xs text-slate-400">Adaptive Signal Timing & Congestion Prediction</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Badges */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              mode === 'adaptive'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${mode === 'adaptive' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{mode === 'adaptive' ? 'AI Adaptive' : 'Fixed Baseline'}</span>
            </div>

            <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Failsafe Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';

export default function LogsView({ alerts }) {
  const [filter, setFilter] = useState('ALL');

  const defaultAlerts = [
    {
      id: "ALERT-01",
      timestamp: new Date().toLocaleTimeString(),
      severity: "INFO",
      category: "SAFETY",
      message: "Mutual exclusion guard verified. North-South and East-West corridors cleared."
    },
    {
      id: "ALERT-02",
      timestamp: new Date(Date.now() - 35000).toLocaleTimeString(),
      severity: "WARNING",
      category: "SAFETY",
      message: "Proposed green (8s) on West Approach was below 10s min threshold. Clamped safely to 10s."
    },
    {
      id: "ALERT-03",
      timestamp: new Date(Date.now() - 95000).toLocaleTimeString(),
      severity: "INFO",
      category: "TIMING",
      message: "Dynamic timing cycle executed: Allocated 42s NS_GREEN, 24s EW_GREEN based on density."
    },
    {
      id: "ALERT-04",
      timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
      severity: "INFO",
      category: "OVERRIDE",
      message: "Traffic operator initiated session. System operating in AI Adaptive Control mode."
    }
  ];

  const list = alerts && alerts.length > 0 ? alerts : defaultAlerts;
  const filtered = filter === 'ALL' ? list : list.filter(a => a.severity === filter);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
        };
      case 'ERROR':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      default:
        return {
          bg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
          icon: <Info className="w-3.5 h-3.5 text-sky-400" />
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>System Alerts & Audit Event Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time tracking of safety clamps, stale data detection, emergency preemption, and timing decisions
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filter === sev ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800">
          {filtered.map((item, index) => {
            const badge = getSeverityBadge(item.severity);
            return (
              <div key={item.id || index} className="p-4 hover:bg-slate-850 transition-colors flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{badge.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg}`}>
                        {item.severity}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.category || 'SYSTEM'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {typeof item.timestamp === 'string' ? item.timestamp : new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {item.id || `LOG-${index}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

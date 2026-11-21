import React, { useState } from 'react';
import { Sliders, Siren, AlertOctagon, RefreshCw, Zap, ShieldAlert, Check, BellRing } from 'lucide-react';

export default function ControlView({ status, mode, onUpdateSimulation }) {
  const [rates, setRates] = useState({
    North: 45,
    South: 40,
    East: 25,
    West: 20
  });

  const [emergencyApproach, setEmergencyApproach] = useState('');
  const [incidentApproach, setIncidentApproach] = useState('');
  const [autoAmbulance, setAutoAmbulance] = useState(true);
  const [appliedMsg, setAppliedMsg] = useState('');

  const handleApply = (newMode = mode, newEmergency = emergencyApproach, newIncident = incidentApproach) => {
    onUpdateSimulation({
      mode: newMode,
      north_traffic_rate: rates.North,
      south_traffic_rate: rates.South,
      east_traffic_rate: rates.East,
      west_traffic_rate: rates.West,
      emergency_approach: newEmergency || null,
      incident_approach: newIncident || null,
      auto_emergency: autoAmbulance,
      clear_emergency: !newEmergency
    });
    setAppliedMsg('Simulation settings applied successfully!');
    setTimeout(() => setAppliedMsg(''), 3000);
  };

  const loadScenario = (type) => {
    let newRates = { North: 30, South: 30, East: 30, West: 30 };
    if (type === 'asymmetric') {
      newRates = { North: 80, South: 75, East: 20, West: 15 };
    } else if (type === 'gridlock') {
      newRates = { North: 88, South: 85, East: 82, West: 80 };
    } else if (type === 'night') {
      newRates = { North: 10, South: 12, East: 8, West: 6 };
    }
    setRates(newRates);
    onUpdateSimulation({
      mode: mode,
      north_traffic_rate: newRates.North,
      south_traffic_rate: newRates.South,
      east_traffic_rate: newRates.East,
      west_traffic_rate: newRates.West
    });
    setAppliedMsg(`Loaded preset scenario: ${type}`);
    setTimeout(() => setAppliedMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Signal Control & Interactive Simulation Lab</span>
          </h2>
          <p className="text-xs text-slate-400">
            Control signal timing policies, simulate peak load scenarios, and test emergency preemption
          </p>
        </div>

        {appliedMsg && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{appliedMsg}</span>
          </div>
        )}
      </div>

      {/* Preset Scenarios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-2">Preset Test Scenarios (PRD Section 11 Evaluation)</h3>
        <p className="text-xs text-slate-400 mb-4">Quickly inject standardized traffic load patterns to compare fixed vs adaptive response</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={() => loadScenario('offpeak')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400">1. Balanced Off-Peak</div>
            <div className="text-[11px] text-slate-400 mt-1">~30 veh/min on all approaches</div>
          </button>
          <button
            onClick={() => loadScenario('asymmetric')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="font-semibold text-xs text-slate-200 group-hover:text-amber-400">2. Heavy Asymmetric Rush</div>
            <div className="text-[11px] text-slate-400 mt-1">North-South: 80, East-West: 18</div>
          </button>
          <button
            onClick={() => loadScenario('gridlock')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
          >
            <div className="font-semibold text-xs text-slate-200 group-hover:text-red-400">3. Severe Gridlock</div>
            <div className="text-[11px] text-slate-400 mt-1">85+ veh/min across all approaches</div>
          </button>
          <button
            onClick={() => loadScenario('night')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition-all group"
          >
            <div className="font-semibold text-xs text-slate-200 group-hover:text-sky-400">4. Late-Night Low Traffic</div>
            <div className="text-[11px] text-slate-400 mt-1">~10 veh/min minimal flow</div>
          </button>
        </div>
      </div>

      {/* 2-Column: Sliders & Emergency Overrides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approach Arrival Sliders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Manual Approach Arrival Rate (veh/min)</h3>
            <span className="text-xs text-slate-400">Adjust demand live</span>
          </div>

          {['North', 'South', 'East', 'West'].map((app) => (
            <div key={app} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{app} Approach</span>
                <span className="font-mono font-bold text-emerald-400">{rates[app]} veh/min</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={rates[app]}
                onChange={(e) => setRates({ ...rates, [app]: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}

          <button
            onClick={() => handleApply()}
            className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            Apply Traffic Rates
          </button>
        </div>

        {/* Emergency Preemption & Accident Injection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Emergency Vehicle & Incident Overrides</span>
          </h3>
          <p className="text-xs text-slate-400">Simulate emergency green corridor preemption or road blockage</p>

          {/* Emergency Vehicle Preemption */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-red-400">
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Emergency Vehicle Preemption</span>
              </div>
              <button
                onClick={() => {
                  setAutoAmbulance(!autoAmbulance);
                  onUpdateSimulation({ auto_emergency: !autoAmbulance, clear_emergency: !autoAmbulance && !emergencyApproach });
                  setAppliedMsg(`Automatic ambulance detection ${!autoAmbulance ? 'enabled' : 'disabled'}`);
                  setTimeout(() => setAppliedMsg(''), 2500);
                }}
                className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                  autoAmbulance ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {autoAmbulance ? 'Auto Detect ON' : 'Auto Detect OFF'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={emergencyApproach}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmergencyApproach(value);
                  handleApply(mode, value, incidentApproach);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="">No Active Emergency (Normal Operation)</option>
                <option value="North">North Approach Corridor</option>
                <option value="South">South Approach Corridor</option>
                <option value="East">East Approach Corridor</option>
                <option value="West">West Approach Corridor</option>
              </select>
              <button
                onClick={() => {
                  setEmergencyApproach('');
                  onUpdateSimulation({ clear_emergency: true, auto_emergency: autoAmbulance });
                  setAppliedMsg('Emergency override cleared');
                  setTimeout(() => setAppliedMsg(''), 2500);
                }}
                className="px-2 py-2 rounded-lg border border-slate-700 bg-slate-900 text-[10px] text-slate-300 hover:text-white"
                title="Clear emergency priority"
              >
                <BellRing className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Incident / Stalled Vehicle */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <AlertOctagon className="w-4 h-4" />
              <span>Simulate Incident / Stalled Vehicle</span>
            </div>
            <select
              value={incidentApproach}
              onChange={(e) => {
                setIncidentApproach(e.target.value);
                handleApply(mode, emergencyApproach, e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="">No Incident (Standard Lane Clearance)</option>
              <option value="North">North Approach (Lane Blocked)</option>
              <option value="South">South Approach (Lane Blocked)</option>
              <option value="East">East Approach (Lane Blocked)</option>
              <option value="West">West Approach (Lane Blocked)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

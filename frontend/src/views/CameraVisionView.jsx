import React, { useState, useEffect } from 'react';
import { 
  Camera, Eye, ShieldAlert, CloudRain, Sun, Moon, CloudFog, 
  Sliders, RefreshCw, Car, AlertTriangle, CheckCircle, Video, Crosshair 
} from 'lucide-react';

export default function CameraVisionView({ onVisionEnvChange }) {
  const [weather, setWeather] = useState('Clear');
  const [occlusion, setOcclusion] = useState(0);
  const [selectedCam, setSelectedCam] = useState('North');
  const [visionData, setVisionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch camera feed data
  const fetchFeeds = async () => {
    try {
      const res = await fetch('/api/vision/camera-feeds');
      if (res.ok) {
        const data = await res.json();
        setVisionData(data);
      }
    } catch (e) {
      // Offline fallback state
      console.warn("Using local vision feed simulation");
    }
  };

  useEffect(() => {
    fetchFeeds();
    const interval = setInterval(fetchFeeds, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyEnvironment = async (newWeather, newOcclusion) => {
    setLoading(true);
    try {
      await fetch('/api/vision/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather: newWeather, occlusion_pct: newOcclusion })
      });
      await fetchFeeds();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate local confidence if offline
  let systemConf = 0.94;
  if (weather === 'Rain') systemConf -= 0.15;
  if (weather === 'Fog') systemConf -= 0.22;
  if (weather === 'Glare') systemConf -= 0.18;
  systemConf -= (occlusion / 100) * 0.40;
  systemConf = Math.max(0.20, Math.min(0.99, Math.round(systemConf * 100) / 100));

  const liveConf = visionData?.system_confidence ?? systemConf;
  const isFallback = visionData?.fallback_active ?? (liveConf < 0.65);

  const approaches = ['North', 'South', 'East', 'West'];

  const feeds = visionData?.feeds || {
    North: {
      camera_id: "CAM-N-01",
      approach: "North",
      resolution: "1920x1080 @ 30 FPS",
      vision_confidence: liveConf,
      vehicle_count_c_kn: 14,
      lane_density_rho_kn: 93.3,
      queue_length_q_kn: 7,
      mean_speed_v_kn: 32.5,
      detections: [
        { id: "DET-N-1", class: "car", confidence: 0.94, bbox: [50, 70, 60, 90] },
        { id: "DET-N-2", class: "bus", confidence: 0.91, bbox: [120, 110, 75, 120] },
        { id: "DET-N-3", class: "truck", confidence: 0.88, bbox: [200, 160, 80, 130] },
        { id: "DET-N-4", class: "motorcycle", confidence: 0.86, bbox: [90, 240, 40, 60] }
      ]
    },
    South: {
      camera_id: "CAM-S-01",
      approach: "South",
      resolution: "1920x1080 @ 30 FPS",
      vision_confidence: liveConf,
      vehicle_count_c_kn: 12,
      lane_density_rho_kn: 80.0,
      queue_length_q_kn: 6,
      mean_speed_v_kn: 34.0,
      detections: [
        { id: "DET-S-1", class: "car", confidence: 0.92, bbox: [60, 80, 55, 85] },
        { id: "DET-S-2", class: "car", confidence: 0.89, bbox: [130, 130, 58, 90] },
        { id: "DET-S-3", class: "motorcycle", confidence: 0.84, bbox: [100, 220, 38, 55] }
      ]
    },
    East: {
      camera_id: "CAM-E-01",
      approach: "East",
      resolution: "1920x1080 @ 30 FPS",
      vision_confidence: liveConf,
      vehicle_count_c_kn: 6,
      lane_density_rho_kn: 40.0,
      queue_length_q_kn: 3,
      mean_speed_v_kn: 41.2,
      detections: [
        { id: "DET-E-1", class: "car", confidence: 0.95, bbox: [70, 90, 60, 90] },
        { id: "DET-E-2", class: "bus", confidence: 0.90, bbox: [150, 150, 70, 110] }
      ]
    },
    West: {
      camera_id: "CAM-W-01",
      approach: "West",
      resolution: "1920x1080 @ 30 FPS",
      vision_confidence: liveConf,
      vehicle_count_c_kn: 5,
      lane_density_rho_kn: 33.3,
      queue_length_q_kn: 2,
      mean_speed_v_kn: 43.5,
      detections: [
        { id: "DET-W-1", class: "car", confidence: 0.96, bbox: [65, 85, 55, 85] },
        { id: "DET-W-2", class: "truck", confidence: 0.87, bbox: [140, 140, 75, 115] }
      ]
    }
  };

  const selectedFeed = feeds[selectedCam] || feeds.North;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>Camera Sensing & YOLO Detection Pipeline</span>
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Stages 1–3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end computer vision pipeline converting camera video into traffic variables: 
            <span className="font-mono text-emerald-300"> Sensing → Detection (YOLO) → Feature Extraction (c_{'{k,n}'}, ρ_{'{k,n}'}, q_{'{k,n}'}, v_{'{k,n}'})</span>
          </p>
        </div>

        {/* System Confidence Indicator */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-sm">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Vision Confidence</span>
            <span className={`text-base font-bold font-mono ${isFallback ? 'text-red-400' : 'text-emerald-400'}`}>
              {(liveConf * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`w-3.5 h-3.5 rounded-full ${isFallback ? 'bg-red-500 animate-ping' : 'bg-emerald-500 ring-4 ring-emerald-500/20'}`} />
        </div>
      </div>

      {/* Safety Fallback Alert Banner (When confidence drops below threshold) */}
      {isFallback && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/60 shadow-lg text-white flex items-start space-x-3 animate-fade-in">
          <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-red-300 text-sm">SAFETY FALLBACK ACTIVATED (PRD Section VIII-C)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900 text-red-200">
                Confidence {(liveConf * 100).toFixed(0)}% &lt; 65% Threshold
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Adverse weather / severe camera occlusion detected. Because visual detection uncertainty is high, 
              the system automatically disengages AI predicted queues and <strong>falls back to the safety-bounded actuated plan</strong> to prevent hazardous starvation or lockouts.
            </p>
          </div>
        </div>
      )}

      {/* Environment Controls: Weather & Occlusion Testing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Visual Robustness & Environmental Stress Testing</h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulate adverse conditions to test detection confidence & fallback logic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weather Options */}
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">Weather & Illumination Conditions</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Clear', label: 'Clear Day', icon: Sun },
                { id: 'Rain', label: 'Heavy Rain', icon: CloudRain },
                { id: 'Fog', label: 'Dense Fog', icon: CloudFog },
                { id: 'Glare', label: 'Sun Glare', icon: AlertTriangle }
              ].map(w => {
                const Icon = w.icon;
                const active = weather === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWeather(w.id);
                      handleApplyEnvironment(w.id, occlusion);
                    }}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Occlusion Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400 font-medium">Camera Lens Occlusion / Obstruction</label>
              <span className="font-mono text-xs font-bold text-emerald-400">{occlusion}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={occlusion}
              onChange={(e) => {
                const val = Number(e.target.value);
                setOcclusion(val);
                handleApplyEnvironment(weather, val);
              }}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% Clear Lens</span>
              <span>40% Moderate Smudge</span>
              <span>80%+ Severe Obstruction (Fallback)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Camera Feeds Multi-Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {approaches.map((app) => {
          const feed = feeds[app];
          const isSelected = selectedCam === app;
          const conf = feed?.vision_confidence ?? liveConf;

          return (
            <div
              key={app}
              onClick={() => setSelectedCam(app)}
              className={`rounded-xl border cursor-pointer transition-all overflow-hidden relative ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              {/* Camera Header Banner */}
              <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{feed?.camera_id || `CAM-${app.slice(0, 1)}`}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({app})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-slate-400">REC</span>
                </div>
              </div>

              {/* Simulated Camera Viewfinder */}
              <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
                {/* Weather Overlay Filter */}
                {weather === 'Rain' && (
                  <div className="absolute inset-0 bg-blue-900/10 pointer-events-none z-10 flex flex-col justify-between opacity-70">
                    <div className="w-full h-full bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:12px_12px]" />
                  </div>
                )}
                {weather === 'Fog' && (
                  <div className="absolute inset-0 bg-slate-300/15 backdrop-blur-[1px] pointer-events-none z-10" />
                )}
                {weather === 'Glare' && (
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-200/20 rounded-full blur-2xl pointer-events-none z-10" />
                )}
                {occlusion > 0 && (
                  <div 
                    className="absolute inset-0 bg-black/60 pointer-events-none z-10" 
                    style={{ opacity: occlusion / 100 }}
                  />
                )}

                {/* Perspective Road Surface */}
                <div className="absolute inset-x-8 inset-y-0 bg-slate-900/70 border-x-2 border-dashed border-slate-700 flex flex-col justify-between items-center py-2">
                  <div className="w-full h-0.5 border-b-2 border-emerald-500/40 my-auto" />
                  <span className="text-[9px] font-mono text-emerald-400/80 bg-black/60 px-1 rounded z-0">
                    VIRTUAL COUNTING LINE
                  </span>
                </div>

                {/* HUD Corner Reticles */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400/80">
                  {feed?.resolution || '1080p'}
                </div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-400">
                  CONF: {(conf * 100).toFixed(0)}%
                </div>

                {/* Simulated YOLO Bounding Boxes */}
                <div className="absolute inset-0 p-3 pointer-events-none z-10">
                  {feed?.detections?.slice(0, 3).map((det, idx) => (
                    <div
                      key={det.id || idx}
                      className={`absolute border rounded text-[8px] font-mono font-bold px-1 py-0.5 shadow-sm ${
                        det.isEmergency
                          ? 'border-red-500 bg-red-500/20 text-red-200 ring-2 ring-red-400'
                          : 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                      }`}
                      style={{
                        top: `${20 + idx * 28}%`,
                        left: `${15 + (idx % 2) * 35}%`,
                        width: '75px',
                        height: '42px'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{det.class}</span>
                        <span>{(det.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Features */}
              <div className="p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Vehicles (c_kn):</span>
                  <span className="font-mono font-bold text-white">{feed?.vehicle_count_c_kn || 0} veh</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Density (ρ_kn):</span>
                  <span className="font-mono font-bold text-emerald-400">{feed?.lane_density_rho_kn || 0} vpm</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Queue (q_kn):</span>
                  <span className="font-mono font-bold text-amber-400">{feed?.queue_length_q_kn || 0} veh</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Camera Inspector & Feature Vector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Feed Inspector */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <span>Camera Inspection & YOLO Detections: {selectedCam} Corridor</span>
              </h3>
              <p className="text-xs text-slate-400">High-resolution frame analysis and classified vehicle bounding boxes</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
              {selectedFeed.camera_id}
            </span>
          </div>

          {/* Detections List */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Detection ID</th>
                  <th className="py-2 px-3">Vehicle Class</th>
                  <th className="py-2 px-3">YOLO Confidence</th>
                  <th className="py-2 px-3">Bounding Box [x, y, w, h]</th>
                  <th className="py-2 px-3">Priority Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {selectedFeed.detections?.map((d) => (
                  <tr key={d.id} className={d.isEmergency ? 'bg-red-500/10' : ''}>
                    <td className="py-2.5 px-3 text-slate-400">{d.id}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white capitalize">{d.class}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{(d.confidence * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-slate-400">[{d.bbox.join(', ')}]</td>
                    <td className="py-2.5 px-3 font-sans">
                      {d.isEmergency ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                          Emergency Preemption
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          Standard Vehicle
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Extraction Pipeline Breakdown (Section VIII-A) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Feature Extraction Vector (x_{'{k,n}'})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Variables synthesized for model input $f_\theta(x_n, x_{'{n-1}'}, \dots)$
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Vehicle Count (c_{'{k,n}'})</span>
                <span className="font-bold text-white">{selectedFeed.vehicle_count_c_kn} vehicles</span>
              </div>
              <span className="text-[10px] text-slate-500">Virtual line crossing</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Lane Density (ρ_{'{k,n}'} = c / L)</span>
                <span className="font-bold text-emerald-400">{selectedFeed.lane_density_rho_kn} veh/km</span>
              </div>
              <span className="text-[10px] text-slate-500">L_k = 150m segment</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Current Queue (q_{'{k,n}'})</span>
                <span className="font-bold text-amber-400">{selectedFeed.queue_length_q_kn} stopped veh</span>
              </div>
              <span className="text-[10px] text-slate-500">Speed &lt; 5 km/h</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Average Approach Speed (v_{'{k,n}'})</span>
                <span className="font-bold text-sky-400">{selectedFeed.mean_speed_v_kn} km/h</span>
              </div>
              <span className="text-[10px] text-slate-500">Optical flow</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Downstream Target</span>
                <span className="font-bold text-emerald-300">q̂_{'{k,n+1}'} Next Cycle Demand</span>
              </div>
              <span className="text-[10px] text-slate-500">Passed to Eq. 7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

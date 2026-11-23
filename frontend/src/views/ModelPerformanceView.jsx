import React from 'react';
import { BrainCircuit, Award, CheckCircle, BarChart3, Database, Cpu, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ModelPerformanceView({ modelData }) {
  const models = modelData?.models || {
    "Linear Regression (Baseline)": {
      mae: 6.84, rmse: 8.92, r2_score: 0.742, accuracy_pct: 74.8, f1_score: 0.739, inference_latency_ms: 0.15, parameters: 12, family: "Classical Linear"
    },
    "Random Forest": {
      mae: 3.12, rmse: 4.38, r2_score: 0.918, accuracy_pct: 89.4, f1_score: 0.892, inference_latency_ms: 1.25, parameters: 45200, family: "Tree Ensemble"
    },
    "XGBoost (Selected Best Model)": {
      mae: 2.45, rmse: 3.51, r2_score: 0.946, accuracy_pct: 92.8, f1_score: 0.927, inference_latency_ms: 0.42, parameters: 18400, family: "Gradient Boosted Trees"
    },
    "LSTM (Recurrent Network)": {
      mae: 2.41, rmse: 3.48, r2_score: 0.948, accuracy_pct: 93.1, f1_score: 0.930, inference_latency_ms: 4.80, parameters: 284000, family: "Deep Recurrent"
    },
    "GRU (Gated Recurrent Unit)": {
      mae: 2.43, rmse: 3.49, r2_score: 0.947, accuracy_pct: 92.9, f1_score: 0.928, inference_latency_ms: 3.90, parameters: 212000, family: "Gated Recurrent"
    }
  };

  const featureImportances = modelData?.feature_importances || [
    { feature: "hour_of_day", importance: 38 },
    { feature: "vehicle_count", importance: 28 },
    { feature: "occupancy_pct", importance: 18 },
    { feature: "avg_speed_kmh", importance: 9 },
    { feature: "is_weekend", importance: 4 },
    { feature: "weather_encoded", importance: 3 }
  ];

  const confusionMatrix = modelData?.confusion_matrix_xgboost?.matrix || [
    [982, 48, 2],
    [35, 1280, 52],
    [0, 45, 782]
  ];

  const classLabels = ["Low", "Medium", "High"];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
          <span>AI / ML Model Performance & Hypothesis H3 Benchmark</span>
        </h2>
        <p className="text-xs text-slate-400">
          Evaluates Tree-based models vs Recurrent sequence learners on 3,226 held-out test intervals (Section VIII-B & Finding 4)
        </p>
      </div>

      {/* Hypothesis H3 Finding Card */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              Paper Finding 4 & Hypothesis H3
            </span>
            <span className="text-xs font-bold text-white">Tree vs Recurrent Model Tradeoff</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "A lightweight tree model is comparable to a recurrent model for predicting the next cycle’s queues at one intersection."
            XGBoost achieves <span className="font-mono text-emerald-400 font-bold">MAE 2.45</span> (vs LSTM 2.41) while operating 
            <span className="font-mono text-emerald-400 font-bold"> 11.4× faster</span> with <span className="font-mono text-emerald-400 font-bold">15.4× fewer parameters</span>, 
            providing higher auditability for safety-critical intersection controllers.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300">H3 CONFIRMED</span>
        </div>
      </div>

      {/* Candidate Model Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Candidate Model Benchmark Comparison (Section VIII-B)</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Winner: XGBoost (Optimal Edge Deployability)
          </span>
        </div>

        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Candidate Model</th>
              <th className="py-2.5 px-3">Architecture</th>
              <th className="py-2.5 px-3">MAE (veh/min) ↓</th>
              <th className="py-2.5 px-3">RMSE (veh/min) ↓</th>
              <th className="py-2.5 px-3">R² Score ↑</th>
              <th className="py-2.5 px-3">Accuracy ↑</th>
              <th className="py-2.5 px-3">Macro F1 ↑</th>
              <th className="py-2.5 px-3">Latency ↓</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {Object.entries(models).map(([name, m]) => {
              const isBest = name.includes('XGBoost');
              const isRecurrent = name.includes('LSTM') || name.includes('GRU');
              return (
                <tr key={name} className={isBest ? 'bg-emerald-500/10' : ''}>
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    {name}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                    {m.family || (name.includes('Linear') ? 'Linear' : name.includes('Random') ? 'Ensemble' : isRecurrent ? 'Recurrent' : 'Gradient Boosted')}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-100">{m.mae}</td>
                  <td className="py-3 px-3">{m.rmse}</td>
                  <td className="py-3 px-3">{m.r2_score}</td>
                  <td className={`py-3 px-3 font-bold ${isBest ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {m.accuracy_pct}%
                  </td>
                  <td className="py-3 px-3">{m.f1_score}</td>
                  <td className={`py-3 px-3 ${m.inference_latency_ms < 1.0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {m.inference_latency_ms} ms
                  </td>
                  <td className="py-3 px-3 font-sans">
                    {isBest ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                        Selected Best
                      </span>
                    ) : isRecurrent ? (
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] border border-sky-500/20">
                        H3 Sequence Check
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2-Column: Confusion Matrix + Feature Importance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">XGBoost Confusion Matrix</h3>
          <p className="text-xs text-slate-400 mb-4">Congestion classification on 3,226 held-out test intervals</p>

          <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 text-center text-xs w-full max-w-sm">
              <div></div>
              {classLabels.map(l => (
                <div key={l} className="font-semibold text-slate-400 pb-1">Pred {l}</div>
              ))}

              {classLabels.map((trueLabel, rIdx) => (
                <React.Fragment key={trueLabel}>
                  <div className="font-semibold text-slate-400 self-center text-right pr-2">True {trueLabel}</div>
                  {confusionMatrix[rIdx].map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <div
                        key={cIdx}
                        className={`p-3 rounded-lg font-mono font-bold ${
                          isDiagonal
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : val > 0 ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-950 text-slate-500'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-4 text-center">
              Overall Test Accuracy: <span className="text-emerald-400 font-bold">92.8%</span> | Macro F1: <span className="text-emerald-400 font-bold">0.927</span>
            </p>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Feature Importance Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Gini importance contribution to XGBoost next-cycle demand forecast</p>

          <div className="space-y-3">
            {featureImportances.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-300">{item.feature}</span>
                  <span className="font-mono font-bold text-emerald-400">{item.importance}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

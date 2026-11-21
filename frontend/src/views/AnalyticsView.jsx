import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Clock, Navigation } from 'lucide-react';

export default function AnalyticsView({ analyticsData }) {
  const hourlyData = analyticsData?.hourly_distribution || [
    { hour: "00:00", vehicles_per_min: 12, avg_speed: 45 },
    { hour: "03:00", vehicles_per_min: 8, avg_speed: 48 },
    { hour: "06:00", vehicles_per_min: 24, avg_speed: 40 },
    { hour: "08:00 (Peak)", vehicles_per_min: 78, avg_speed: 18 },
    { hour: "10:00", vehicles_per_min: 45, avg_speed: 32 },
    { hour: "13:00", vehicles_per_min: 38, avg_speed: 35 },
    { hour: "17:00 (Peak)", vehicles_per_min: 86, avg_speed: 15 },
    { hour: "20:00", vehicles_per_min: 52, avg_speed: 28 },
    { hour: "22:00", vehicles_per_min: 28, avg_speed: 38 },
  ];

  const approachData = [
    { name: 'North', volume: 82, share: 32, delay: 24 },
    { name: 'South', volume: 74, share: 28, delay: 21 },
    { name: 'East', volume: 54, share: 22, delay: 17 },
    { name: 'West', volume: 46, share: 18, delay: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Traffic Analytics & Diurnal Trends</span>
        </h2>
        <p className="text-xs text-slate-400">
          Historical analysis of peak-hour volume spikes, speed degradation, and directional traffic flow
        </p>
      </div>

      {/* Hourly Flow vs Speed Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Diurnal Traffic Flow vs. Average Speed</h3>
            <p className="text-xs text-slate-400">Demonstrates speed reduction during morning (08:00) and evening (17:00) peak rush hours</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Flow (veh/min)</span>
            </span>
            <span className="flex items-center space-x-1 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>Speed (km/h)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="vehicles_per_min" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" name="Flow (vpm)" />
              <Area type="monotone" dataKey="avg_speed" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" name="Speed (km/h)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Row: Approach Volume Breakdown & Peak Delay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approach Volume Share */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Peak Volume by Approach Corridor</h3>
          <p className="text-xs text-slate-400 mb-4">Directional demand distribution across 4 intersection arms</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} name="Peak Volume (vpm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay per Approach */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Average Wait Delay per Approach</h3>
          <p className="text-xs text-slate-400 mb-4">Seconds delay experienced by approaching traffic</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="delay" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Delay (seconds)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

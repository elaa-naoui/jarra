"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Thermometer, Wind, Droplets, Calendar } from "lucide-react";

interface TelemetryPoint {
  time: string;
  temperature: number;
  airHumidity: number;
  soilMoisture: number;
  light: number;
}

const SAMPLE_TELEMETRY: TelemetryPoint[] = [
  { time: "06:00", temperature: 18.2, airHumidity: 74, soilMoisture: 70, light: 120 },
  { time: "08:00", temperature: 21.0, airHumidity: 68, soilMoisture: 68, light: 450 },
  { time: "10:00", temperature: 24.6, airHumidity: 58, soilMoisture: 65, light: 780 },
  { time: "12:00", temperature: 28.4, airHumidity: 48, soilMoisture: 61, light: 980 },
  { time: "14:00", temperature: 30.1, airHumidity: 42, soilMoisture: 58, light: 1020 },
  { time: "16:00", temperature: 27.5, airHumidity: 50, soilMoisture: 56, light: 810 },
  { time: "18:00", temperature: 23.8, airHumidity: 62, soilMoisture: 62, light: 390 },
  { time: "20:00", temperature: 20.4, airHumidity: 70, soilMoisture: 64, light: 80 },
];

export const TelemetryCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "temp" | "humidity" | "soil">("all");

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Dynamique Microclimatique & Sol (IoT Recharts)
          </h3>
          <p className="text-xs text-slate-500">
            Suivi 24h : corrélation température, humidité atmosphérique et humidité racinaire
          </p>
        </div>

        {/* Sélecteur de courbe */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "all" ? "bg-white text-emerald-800 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            Vue combinée
          </button>
          <button
            onClick={() => setActiveTab("temp")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "temp" ? "bg-white text-amber-700 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            Température
          </button>
          <button
            onClick={() => setActiveTab("humidity")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "humidity" ? "bg-white text-blue-700 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            Humidité Air
          </button>
          <button
            onClick={() => setActiveTab("soil")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "soil" ? "bg-white text-emerald-700 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            Humidité Sol
          </button>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SAMPLE_TELEMETRY} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d84315" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d84315" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1565c0" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1565c0" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />

            {(activeTab === "all" || activeTab === "temp") && (
              <Area
                type="monotone"
                dataKey="temperature"
                name="Température (°C)"
                stroke="#d84315"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
            )}

            {(activeTab === "all" || activeTab === "humidity") && (
              <Area
                type="monotone"
                dataKey="airHumidity"
                name="Humidité Air (%)"
                stroke="#1565c0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHumidity)"
              />
            )}

            {(activeTab === "all" || activeTab === "soil") && (
              <Area
                type="monotone"
                dataKey="soilMoisture"
                name="Humidité Sol (%)"
                stroke="#2e7d32"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSoil)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini-indicateurs de synthèse */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-amber-800 font-semibold">T° Moyenne Journalière</p>
            <p className="text-base font-black text-amber-950">24.5 °C</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-blue-800 font-semibold">Hygrométrie Moyenne</p>
            <p className="text-base font-black text-blue-950">59.0 %</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-semibold">Humidité Sol Moyenne</p>
            <p className="text-base font-black text-emerald-950">63.4 %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

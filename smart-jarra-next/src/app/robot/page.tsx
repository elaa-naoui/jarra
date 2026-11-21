import React from "react";
import { RobotMap } from "@/components/RobotMap";
import { Bot, Radio, Camera, Cpu } from "lucide-react";

export default function RobotPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de page */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
          <Bot className="w-3.5 h-3.5 text-blue-700" />
          Module 2 • Robotique Mobile & IoT
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Robot Mobile Virtuel « JarraBot »
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Patrouille autonome dans le jardin urbain : navigation pot à pot, lecture sans contact du tag NFC, capture photographique, télémesure des sondes et diagnostic IA instantané.
        </p>
      </div>

      {/* Composant interactif du Robot et de la carte du jardin */}
      <RobotMap />

      {/* Fiche technique du Robot pour le Jury */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <h3 className="text-base font-black text-slate-900 mb-4">
          Spécifications Techniques du Robot Virtuel
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-blue-600" /> Lecteur NFC
            </span>
            <p className="text-slate-500 text-[11px]">
              Module RFID/NFC 13.56 MHz (ISO 14443A) pour identification infalsifiable du végétal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" /> Caméra Spectrale
            </span>
            <p className="text-slate-500 text-[11px]">
              Capteur optique haute résolution pour extraction des indices chlorophylliens foliaires.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-600" /> Microcontrôleur IoT
            </span>
            <p className="text-slate-500 text-[11px]">
              Architecture ESP32 / Raspberry Pi avec transmission Wi-Fi/MQTT vers Supabase.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-600" /> Navigation
            </span>
            <p className="text-slate-500 text-[11px]">
              Asservissement différentiel avec odométrie et détection de ligne au sol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

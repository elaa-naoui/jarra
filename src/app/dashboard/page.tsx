"use client";

import React from "react";
import {
  LayoutDashboard,
  Sprout,
  AlertTriangle,
  Bug,
  Droplets,
  Waves,
  Bot,
  Zap,
  RotateCw,
  Bell,
  CheckCircle,
  Thermometer,
  Wind,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useJarraStore } from "@/store/useJarraStore";
import { TelemetryCharts } from "@/components/Charts";
import { HydroEcosystem } from "@/components/HydroEcosystem";

export default function DashboardPage() {
  const {
    plants,
    jars,
    aquarium,
    rainwaterTank,
    robotState,
    alerts,
    dismissAlert,
  } = useJarraStore();

  // Calcul des métriques KPI
  const totalPlants = plants.length;
  const waterStressCount = plants.filter((p) => p.status === "water_stress").length;
  const diseasedCount = plants.filter(
    (p) => p.status === "disease_spots" || p.status === "yellow_leaves" || p.status === "wilting"
  ).length;
  const jarList = Object.values(jars);
  const activeJarsCount = jarList.length;
  const avgJarLevel =
    jarList.length > 0
      ? Math.round(jarList.reduce((acc, j) => acc + j.level, 0) / jarList.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            Module 5 • Supervision Globale
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Tableau de Bord — Smart Jarra
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervision temps réel de l&apos;agriculture urbaine : microclimat, bilan hydrique, état sanitaire et énergie.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            Télémétrie Active
          </span>
        </div>
      </div>

      {/* Grille des 6 KPIs Clés */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 : Total Plantes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Plantes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalPlants}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Pieds surveillés</span>
        </div>

        {/* KPI 2 : Stress Hydrique */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase">Stress Hydrique</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-900">{waterStressCount}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Besoin d&apos;eau immédiat</span>
        </div>

        {/* KPI 3 : Plantes Malades */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase">Anomalies Foliaires</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900">{diseasedCount}</p>
          <span className="text-[11px] text-rose-700 font-semibold">Chlorose / Maladie</span>
        </div>

        {/* KPI 4 : Jarres Actives */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase">Jarres Actives</span>
            <span className="text-xl">🏺</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{activeJarsCount}</p>
          <span className="text-[11px] text-slate-500 font-semibold">Niveau moy. {avgJarLevel}%</span>
        </div>

        {/* KPI 5 : Niveau Réservoir Eau de Pluie */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-700 uppercase">Réservoir Pluie</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-cyan-950">{rainwaterTank.level}%</p>
          <span className="text-[11px] text-cyan-700 font-semibold">{rainwaterTank.currentLiters} Litres dispo</span>
        </div>

        {/* KPI 6 : Aquarium Aquaponique */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase">Aquarium</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-950">{aquarium.level}%</p>
          <span className="text-[11px] text-blue-700 font-semibold">pH {aquarium.ph} • {aquarium.temperature}°C</span>
        </div>
      </div>

      {/* Graphiques Microclimatiques & Sol (Recharts) */}
      <TelemetryCharts />

      {/* Écosystème Hydraulique & Énergie */}
      <HydroEcosystem />

      {/* Grille : Statut Robot & Alertes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Gauche : Statut du Robot Mobile */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              État du Robot Mobile (JarraBot)
            </h3>
            <Link
              href="/robot"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Voir la carte →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Statut opérationnel :</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full border ${
                  robotState.isRunning
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-slate-200 text-slate-700 border-slate-300"
                }`}
              >
                {robotState.isRunning ? "En déplacement" : "En veille"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Phase active :</span>
              <span className="font-mono font-bold text-slate-800">
                {robotState.phase.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Dernier Tag NFC lu :</span>
              <span className="font-mono font-bold text-blue-700">
                {robotState.lastReadNfc || "En attente"}
              </span>
            </div>

            <p className="text-xs text-slate-600 italic pt-1">
              {robotState.statusMessage}
            </p>
          </div>

          <Link
            href="/robot"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Accéder à la console de commande du Robot
          </Link>
        </div>

        {/* Colonne Droite : Alertes Récentes */}
        <div id="alertes" className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600" />
              Journal des Alertes & Événements
            </h3>
            <span className="text-xs text-slate-400 font-medium font-mono">
              {alerts.length} événements
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucune alerte active. Tout le jardin urbain est sous contrôle.
              </div>
            ) : (
              alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                    al.type === "danger"
                      ? "bg-rose-50/70 border-rose-200 text-rose-950"
                      : al.type === "warning"
                      ? "bg-amber-50/70 border-amber-200 text-amber-950"
                      : al.type === "success"
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                      : "bg-blue-50/70 border-blue-200 text-blue-950"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[10px] opacity-75 font-mono">
                      <span>{new Date(al.created_at).toLocaleTimeString("fr-FR")}</span>
                      <span className="uppercase font-bold">[{al.type}]</span>
                    </div>
                    <p className="font-semibold leading-relaxed">{al.message}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(al.id)}
                    className="p-1 rounded-lg hover:bg-black/5 text-slate-500"
                    title="Ignorer l'alerte"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  Droplets,
  Fish,
  Zap,
  RotateCw,
  Waves,
  Gauge,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useJarraStore } from "@/store/useJarraStore";

export const HydroEcosystem: React.FC = () => {
  const {
    aquarium,
    rainwaterTank,
    microTurbine,
    noriaWell,
    jars,
    plants,
    refillJar,
    operateNoriaWell,
    activateTurbine,
  } = useJarraStore();

  const jarList = Object.values(jars);
  const avgJarLevel =
    jarList.length > 0
      ? Math.round(jarList.reduce((acc, j) => acc + j.level, 0) / jarList.length)
      : 80;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Waves className="w-6 h-6 text-blue-600" />
            Écosystème Hydraulique & Énergétique Intégré
          </h3>
          <p className="text-xs text-slate-500">
            Couplage symbiotique : Jarres enterrées microporeuses, Bassin aquaponique, Récupérateur de pluie, Puits à godets & Micro-turbine
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Circuit Fermé & Zéro Gaspillage
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Jarres Enterrées Traditionnelles */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🏺</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Poreux 100%
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Jarres Enterrées</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Diffusion microporeuse souterraine directement aux radicelles
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Niveau moyen :</span>
              <span className="font-bold text-amber-700">{avgJarLevel}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                style={{ width: `${avgJarLevel}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {jarList.length} jarres actives surveillées
            </p>
          </div>

          <button
            onClick={() => {
              if (plants[0]) refillJar(plants[0].id);
            }}
            className="w-full py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            Recharger jarre #1
          </button>
        </div>

        {/* 2. Bassin Aquaponique */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Fish className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                Symbiose
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Aquarium Aquaponique</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Élevage Tilapia + biofiltration nitrifiante pour les plantes
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Niveau eau :</span>
              <strong className="text-blue-700">{aquarium.level}%</strong>
            </div>
            <div className="flex justify-between">
              <span>pH / Temp :</span>
              <strong>{aquarium.ph} • {aquarium.temperature}°C</strong>
            </div>
            <div className="flex justify-between">
              <span>Nitrates (NO3-) :</span>
              <strong className="text-emerald-700">{aquarium.nitrate} mg/L</strong>
            </div>
            <div className="flex justify-between">
              <span>Poissons :</span>
              <strong>{aquarium.fish_count} Tilapias</strong>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-blue-50 text-[10px] text-blue-800 font-semibold text-center">
            Ammoniac sous contrôle (0.018 mg/L)
          </div>
        </div>

        {/* 3. Réservoir Eau de Pluie */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                Toiture
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Réservoir Eau de Pluie</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Collecte pluviale gravitaire filtrée sur sable et charbon
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Volume stocké :</span>
              <span className="font-bold text-cyan-700">
                {rainwaterTank.currentLiters} L / {rainwaterTank.capacityLiters} L
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${rainwaterTank.level}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Remplissage à {rainwaterTank.level}% de sa capacité
            </p>
          </div>

          <div className="p-2 rounded-xl bg-cyan-50 text-[10px] text-cyan-900 font-semibold text-center">
            Prêt pour arrosage et jarres
          </div>
        </div>

        {/* 4. Puits & Roue à Godets (Noria traditionnelle) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <RotateCw className={`w-5 h-5 ${noriaWell.isOperating ? "animate-spin" : ""}`} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                Manuel & Solaire
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Puits & Roue à Godets</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Exhaure mécanique inspirée des norias tunisiennes
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Profondeur nappe :</span>
              <strong>{noriaWell.depthMeters} m</strong>
            </div>
            <div className="flex justify-between">
              <span>Eau puisée :</span>
              <strong className="text-orange-700">{noriaWell.waterExtractedLiters} L</strong>
            </div>
            <div className="flex justify-between">
              <span>État roue :</span>
              <strong className={noriaWell.isOperating ? "text-emerald-600 font-bold" : ""}>
                {noriaWell.isOperating ? "Rotation active" : "À l'arrêt"}
              </strong>
            </div>
          </div>

          <button
            onClick={operateNoriaWell}
            disabled={noriaWell.isOperating}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              noriaWell.isOperating
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 active:scale-95"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            {noriaWell.isOperating ? "Exhaure en cours..." : "Actionner la roue"}
          </button>
        </div>

        {/* 5. Turbine Hydraulique */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Énergie Propre
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900">Turbine Hydraulique</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Micro-génération hydroélectrique lors du flux gravitaire d&apos;eau
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Puissance instantanée :</span>
              <strong className="text-emerald-700">{microTurbine.powerWatts} W</strong>
            </div>
            <div className="flex justify-between">
              <span>Énergie cumulée :</span>
              <strong className="text-slate-900">{microTurbine.energyProducedWh} Wh</strong>
            </div>
            <div className="flex justify-between">
              <span>Rotor :</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                En rotation
              </span>
            </div>
          </div>

          <button
            onClick={activateTurbine}
            className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Activer surpression
          </button>
        </div>
      </div>
    </div>
  );
};

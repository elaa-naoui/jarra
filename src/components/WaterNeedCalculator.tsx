"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  Calendar,
  CheckCircle,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useJarraStore } from "@/store/useJarraStore";
import { aiWaterNeed, getSeasonForPlant, PLANT_SEASONS } from "@/lib/aiWaterNeed";
import { PlantType, Season, AIWaterNeedResult } from "@/types";

const PLANT_TYPES: PlantType[] = [
  "Tomate",
  "Menthe",
  "Basilic",
  "Persil",
  "Romarin",
  "Laitue",
  "Fraise",
];

const DEFAULT_PLANT_NAMES: Record<PlantType, string> = {
  Tomate: "Tomate Cerise Mornag",
  Menthe: "Menthe Verte Zaghouan",
  Basilic: "Basilic Grand Vert",
  Persil: "Persil Plat Tunisien",
  Romarin: "Romarin Sauvage Chaambi",
  Laitue: "Laitue Romaine Ariana",
  Fraise: "Fraise Gariguette Cap Bon",
};

export const WaterNeedCalculator: React.FC = () => {
  const addPlant = useJarraStore((s) => s.addPlant);

  // États du formulaire
  const [plantType, setPlantType] = useState<PlantType>("Tomate");
  const [plantName, setPlantName] = useState<string>(DEFAULT_PLANT_NAMES.Tomate);
  const [season, setSeason] = useState<Season>("printemps");

  // Paramètres environnementaux
  const [temperature, setTemperature] = useState<number>(26);
  const [airHumidity, setAirHumidity] = useState<number>(50);
  const [soilMoisture, setSoilMoisture] = useState<number>(45);
  const [light, setLight] = useState<number>(850);
  const [rain, setRain] = useState<number>(0);

  // Résultat du calcul IA
  const [result, setResult] = useState<AIWaterNeedResult | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mise à jour automatique de la saison selon le type de plante choisi
  useEffect(() => {
    const autoSeason = getSeasonForPlant(plantType);
    setSeason(autoSeason);
    setPlantName(DEFAULT_PLANT_NAMES[plantType]);
  }, [plantType]);

  // Calcul du score IA à chaque modification des curseurs
  const handleCalculate = () => {
    const res = aiWaterNeed({
      plantType,
      temperature,
      airHumidity,
      soilMoisture,
      season,
      light,
      rain,
    });
    setResult(res);
  };

  // Calcul initial automatique
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantType, season, temperature, airHumidity, soilMoisture, light, rain]);

  const handleSaveToDatabase = async () => {
    if (!result || !plantName.trim()) return;
    setIsAdding(true);

    try {
      await addPlant({
        name: plantName.trim(),
        type: plantType,
        season: season,
        water_need: result.waterNeed,
        irrigation_method: result.recommendedMethod,
        status: "healthy",
      });

      setSuccessMessage(
        `« ${plantName} » a été enregistrée avec succès avec la méthode ${result.recommendedMethod} !`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-8">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            Plantation Immédiate & Algorithme Prédictif d&apos;Irrigation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Détermination automatique de la saison, calcul du score hydrique (0-100) et choix technologique
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Algorithme Agronomique Validé
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire & Curseurs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sélection Plante & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Type de Plante :
              </label>
              <select
                value={plantType}
                onChange={(e) => setPlantType(e.target.value as PlantType)}
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {PLANT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nom personnalisé du plant :
              </label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Ex: Menthe Verte de Zaghouan"
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Saison Automatique */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  Saison culturale automatique
                </p>
                <p className="text-sm font-black text-emerald-950 capitalize">
                  {season}
                </p>
              </div>
            </div>
            <span className="text-xs bg-white text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-300">
              Auto-déduit de {plantType}
            </span>
          </div>

          {/* Paramètres Environnementaux IoT */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conditions Microclimatiques Actuelles (Sondes IoT)
            </h3>

            {/* Température */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Température Ambiante :
                </span>
                <span className="font-bold text-amber-700">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Humidité Air */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-blue-600" /> Humidité de l&apos;Air :
                </span>
                <span className="font-bold text-blue-700">{airHumidity} %</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                value={airHumidity}
                onChange={(e) => setAirHumidity(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Humidité Sol */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-600" /> Humidité du Sol :
                </span>
                <span className="font-bold text-emerald-700">{soilMoisture} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Lumière & Pluie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-yellow-500" /> Ensoleillement :
                  </span>
                  <span className="font-bold text-yellow-600">{light} lux</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={light}
                  onChange={(e) => setLight(Number(e.target.value))}
                  className="w-full accent-yellow-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-indigo-500" /> Pluie Récente :
                  </span>
                  <span className="font-bold text-indigo-600">{rain} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={rain}
                  onChange={(e) => setRain(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panneau de Recommandation IA */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Score & Décision Agronomique
              </h3>
              <span className="text-xs font-bold text-slate-500">Moteur IA</span>
            </div>

            {result && (
              <div className="space-y-4">
                {/* Jauge Score */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Score de Besoin en Eau :
                    </p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {result.score} <span className="text-sm text-slate-400 font-bold">/ 100</span>
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                      result.score >= 70
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : result.score >= 40
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-blue-50 text-blue-700 border-blue-300"
                    }`}
                  >
                    Besoin {result.waterNeed}
                  </div>
                </div>

                {/* Méthode recommandée */}
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500/80 shadow-sm space-y-2">
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Méthode d&apos;irrigation préconisée :
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {result.recommendedMethod === "Hydroponie"
                        ? "💧"
                        : result.recommendedMethod === "Jarre enterrée"
                        ? "🏺"
                        : "🌿"}
                    </span>
                    <h4 className="text-lg font-black text-emerald-800">
                      {result.recommendedMethod}
                    </h4>
                  </div>
                </div>

                {/* Raison agronomique */}
                <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">Raison agronomique :</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {result.reason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action : Ajouter la plante */}
          <div className="space-y-3">
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              onClick={handleSaveToDatabase}
              disabled={isAdding}
              className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isAdding
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25 active:scale-98"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              {isAdding ? "Enregistrement en cours..." : "Ajouter la plante à la base de données"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

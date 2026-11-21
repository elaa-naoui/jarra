"use client";

import React, { useState } from "react";
import {
  Play,
  Square,
  Radio,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Thermometer,
  Wind,
  Edit2,
  Check,
  Eye,
  Bot,
} from "lucide-react";
import { useJarraStore } from "@/store/useJarraStore";
import { DIAGNOSTIC_DETAILS } from "@/lib/tfPlantClassifier";
import { Plant } from "@/types";

export const RobotMap: React.FC = () => {
  const {
    plants,
    robotState,
    startRobot,
    stopRobot,
    updatePlant,
    measurements,
  } = useJarraStore();

  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedPlantForDetails, setSelectedPlantForDetails] = useState<Plant | null>(null);

  const handleStartEdit = (plant: Plant) => {
    setEditingPlantId(plant.id);
    setEditingName(plant.name);
  };

  const handleSaveEdit = (plantId: string) => {
    if (editingName.trim()) {
      updatePlant(plantId, { name: editingName.trim() });
    }
    setEditingPlantId(null);
  };

  const currentPlant = plants[robotState.currentPotIndex] || plants[0];
  const activeMeasurements = measurements.filter(
    (m) => m.plant_id === (currentPlant?.id || "")
  );

  return (
    <div className="space-y-6">
      {/* Barre d'action supérieure */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800">
                Robot Mobile Autonome « JarraBot »
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  robotState.isRunning
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse"
                    : "bg-slate-100 text-slate-600 border-slate-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    robotState.isRunning ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {robotState.isRunning ? "En patrouille active" : "À la station de charge"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patrouille géolocalisée, lecteur NFC intégré, caméra spectrale & sondes T/H/Sol
            </p>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex items-center gap-3">
          <button
            onClick={startRobot}
            disabled={robotState.isRunning || plants.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
              robotState.isRunning || plants.length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-95"
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            Lancer le robot
          </button>

          <button
            onClick={stopRobot}
            disabled={!robotState.isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              !robotState.isRunning
                ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 active:scale-95"
            }`}
          >
            <Square className="w-4 h-4 fill-rose-600" />
            Arrêter le robot
          </button>
        </div>
      </div>

      {/* Bannière de statut d'inspection temps réel */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-sm font-medium tracking-wide">
            <span className="text-emerald-400 font-bold uppercase text-xs mr-2">
              Statut en direct :
            </span>
            {robotState.statusMessage}
          </p>
        </div>
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-300 font-mono">
          Étape : {robotState.phase.toUpperCase()}
        </span>
      </div>

      {/* Carte visuelle du jardin avec pots et cheminement du robot */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Plan Interactif du Jardin Urbain
            </h3>
            <p className="text-xs text-slate-500">
              Disposition des pots en terre cuite, balises NFC et trajectoire du rover
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Saine
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Stress hydrique
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Malade
            </span>
          </div>
        </div>

        {/* Grille des pots dans le jardin */}
        <div className="relative bg-emerald-50/40 border-2 border-dashed border-emerald-200/80 rounded-2xl p-6 min-h-[360px] flex items-center justify-center overflow-hidden">
          {/* Ligne directrice du robot */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full relative z-10">
            {plants.map((plant, index) => {
              const isTargeted = robotState.isRunning && robotState.currentPotIndex === index;
              const meta = DIAGNOSTIC_DETAILS[plant.status] || DIAGNOSTIC_DETAILS.healthy;

              return (
                <div
                  key={plant.id}
                  className={`relative p-4 rounded-2xl bg-white border-2 transition-all flex flex-col items-center text-center group ${
                    isTargeted
                      ? "border-emerald-600 ring-4 ring-emerald-500/20 scale-105 shadow-elevated"
                      : "border-slate-200 hover:border-emerald-300 shadow-sm"
                  }`}
                >
                  {/* Badge NFC virtuel */}
                  <div className="absolute top-2 right-2">
                    <span
                      title={`Puce NFC : ${plant.nfc_id}`}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                        isTargeted && robotState.phase === "scanning_nfc"
                          ? "bg-blue-600 text-white animate-bounce"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Radio className="w-2.5 h-2.5" />
                      {plant.nfc_id.replace("NFC-TUN-", "#")}
                    </span>
                  </div>

                  {/* Indicateur Robot au-dessus du pot si ciblé */}
                  {isTargeted && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-lg border border-emerald-400 animate-bounce">
                      <Bot className="w-3 h-3 text-emerald-400" />
                      <span>JarraBot</span>
                    </div>
                  )}

                  {/* Pot en terre cuite visuel */}
                  <div className="relative my-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <span className="text-3xl">🏺</span>
                    </div>
                    {/* Statut santé pastille */}
                    <span
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold ${
                        plant.status === "healthy"
                          ? "bg-emerald-500"
                          : plant.status === "water_stress"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    >
                      {plant.status === "healthy" ? "✓" : "!"}
                    </span>
                  </div>

                  {/* Nom éditable */}
                  <div className="w-full mt-1">
                    {editingPlantId === plant.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full text-xs font-bold border border-emerald-500 rounded px-1.5 py-0.5 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(plant.id)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 group/name">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                          {plant.name}
                        </span>
                        <button
                          onClick={() => handleStartEdit(plant)}
                          className="opacity-0 group-hover/name:opacity-100 p-0.5 text-slate-400 hover:text-emerald-600"
                          title="Modifier le nom"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium">{plant.type}</p>
                  </div>

                  {/* Méthode d'irrigation */}
                  <span className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {plant.irrigation_method}
                  </span>

                  {/* Bouton Fiche */}
                  <button
                    onClick={() => setSelectedPlantForDetails(plant)}
                    className="mt-3 text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Détails
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pupitre d'analyse temps-réel du pot actuel */}
      {currentPlant && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fiche plante & Caméra robotique */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Capture Optique Robot
              </h3>
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {currentPlant.nfc_id}
              </span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {currentPlant.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentPlant.photo_url}
                  alt={currentPlant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Aucune image disponible</p>
                </div>
              )}

              {/* Réticule de visée robotique */}
              <div className="absolute inset-4 border border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                  <span>SPEC-CAM-V2</span>
                  <span>ISO 200 • 1/250s</span>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                  <span>FOCUS: RACINES/FEUILLE</span>
                  <span>AI: ONLINE</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">{currentPlant.name}</h4>
              <p className="text-xs text-slate-500">
                Type : {currentPlant.type} • Saison : {currentPlant.season}
              </p>
            </div>
          </div>

          {/* Sondes IoT mesurées */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Télémesures Capteurs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                  <Thermometer className="w-4 h-4" /> Température
                </span>
                <p className="text-2xl font-black text-amber-900 mt-2">25.4°C</p>
                <span className="text-[10px] text-amber-600">Ambiance optimale</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
                <span className="text-xs text-blue-700 font-bold flex items-center gap-1">
                  <Wind className="w-4 h-4" /> Humidité Air
                </span>
                <p className="text-2xl font-black text-blue-900 mt-2">58%</p>
                <span className="text-[10px] text-blue-600">Hygrométrie stable</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Droplets className="w-4 h-4" /> Humidité Sol
                </span>
                <p className="text-2xl font-black text-emerald-900 mt-2">
                  {currentPlant.status === "water_stress" ? "32%" : "66%"}
                </p>
                <span className="text-[10px] text-emerald-600">
                  {currentPlant.status === "water_stress" ? "Déficit d'eau" : "Sol équilibré"}
                </span>
              </div>
            </div>

            {/* Diagnostic IA */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Diagnostic IA Foliaire :</span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                    DIAGNOSTIC_DETAILS[currentPlant.status].badgeColor
                  }`}
                >
                  {DIAGNOSTIC_DETAILS[currentPlant.status].labelFr}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {DIAGNOSTIC_DETAILS[currentPlant.status].description}
              </p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-800">Recommandation : </span>
                <span className="text-xs text-slate-700">
                  {DIAGNOSTIC_DETAILS[currentPlant.status].recommendation}
                </span>
              </div>
            </div>
          </div>

          {/* Historique des passages du robot */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Historique des Scans
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {activeMeasurements.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Aucune mesure historique pour cette plante. Lancer le robot pour enregistrer la première passe.
                </p>
              ) : (
                activeMeasurements.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                      <span>{new Date(m.created_at).toLocaleTimeString("fr-FR")}</span>
                      <span className="text-emerald-700 font-bold">Confiance: {m.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>T: {m.temperature}°C • Air: {m.air_humidity}% • Sol: {m.soil_moisture}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">{m.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Plante */}
      {selectedPlantForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-elevated animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedPlantForDetails.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Identifiant NFC : {selectedPlantForDetails.nfc_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlantForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Type de plante :</span>
                <span className="font-semibold">{selectedPlantForDetails.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Saison culturale :</span>
                <span className="font-semibold">{selectedPlantForDetails.season}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Besoin en eau :</span>
                <span className="font-semibold">{selectedPlantForDetails.water_need}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Méthode préconisée :</span>
                <span className="font-semibold text-emerald-700">
                  {selectedPlantForDetails.irrigation_method}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">État sanitaire actuel :</span>
                <span className="font-semibold text-slate-900">
                  {DIAGNOSTIC_DETAILS[selectedPlantForDetails.status].labelFr}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPlantForDetails(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

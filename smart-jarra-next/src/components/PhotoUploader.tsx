"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { useJarraStore } from "@/store/useJarraStore";
import {
  analyzePlantPhotoSimulation,
  analyzePlantPhotoTFJS,
  DIAGNOSTIC_DETAILS,
} from "@/lib/tfPlantClassifier";
import { PhotoAnalysisResult, DiagnosticClass } from "@/types";

const SAMPLE_LEAF_PRESETS = [
  {
    name: "Feuille Saine (Tomate)",
    url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
    expected: "healthy" as DiagnosticClass,
  },
  {
    name: "Stress Hydrique (Basilic)",
    url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80",
    expected: "water_stress" as DiagnosticClass,
  },
  {
    name: "Chlorose / Jaunissement (Laitue)",
    url: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80",
    expected: "yellow_leaves" as DiagnosticClass,
  },
  {
    name: "Taches Foliaires (Maladie)",
    url: "https://images.unsplash.com/photo-1596724803738-98e3bfa7be0a?auto=format&fit=crop&w=600&q=80",
    expected: "disease_spots" as DiagnosticClass,
  },
];

export const PhotoUploader: React.FC = () => {
  const {
    plants,
    isRealModelActive,
    toggleRealModel,
    updatePlant,
    addAlert,
  } = useJarraStore();

  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>(SAMPLE_LEAF_PRESETS[0].url);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
          setAnalysisResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    setAnalysisResult(null);
  };

  const handleSelectExistingPlant = (plantId: string) => {
    setSelectedPlantId(plantId);
    const plant = plants.find((p) => p.id === plantId);
    if (plant?.photo_url) {
      setPreviewUrl(plant.photo_url);
      setAnalysisResult(null);
    }
  };

  const handleRunAnalysis = async () => {
    if (!previewUrl) return;
    setAnalyzing(true);

    try {
      let result: PhotoAnalysisResult;

      if (isRealModelActive && imageElementRef.current) {
        result = await analyzePlantPhotoTFJS(imageElementRef.current);
      } else {
        result = await analyzePlantPhotoSimulation(previewUrl);
      }

      setAnalysisResult(result);

      // Si une plante existante était sélectionnée, mise à jour automatique
      if (selectedPlantId) {
        updatePlant(selectedPlantId, {
          status: result.diagnostic,
          photo_url: previewUrl,
        });

        addAlert({
          plant_id: selectedPlantId,
          type: result.diagnostic === "healthy" ? "success" : "warning",
          message: `Diagnostic photo IA mis à jour : ${result.labelFr} (${result.confidence}%)`,
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse :", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de mode IA */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Moteur d&apos;Inférence IA</h3>
            <p className="text-xs text-slate-500">
              Modèle actuel :{" "}
              <strong className="text-blue-700 font-bold">
                {isRealModelActive
                  ? "TensorFlow.js (MobileNet & PlantVillage Adapter)"
                  : "Simulation Agronomique Calibrée"}
              </strong>
            </p>
          </div>
        </div>

        <button
          onClick={toggleRealModel}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isRealModelActive
              ? "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isRealModelActive ? "Mode Réel TF.js Actif (Cliquer pour Simulation)" : "Activer le modèle IA réel (TF.js)"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche : Téléversement & Prévisualisation */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              1. Sélectionner l&apos;image foliaire
            </h3>
            <p className="text-xs text-slate-500">
              Téléversez une photo de feuille de votre plante ou utilisez un échantillon pré-calibré
            </p>
          </div>

          {/* Option : Associer à une plante existante */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Associer à une plante existante (optionnel) :
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => handleSelectExistingPlant(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Choisir une plante du jardin urbain --</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.nfc_id})
                </option>
              ))}
            </select>
          </div>

          {/* Zone de prévisualisation & Dropzone */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-emerald-300/80 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageElementRef}
              src={previewUrl}
              alt="Feuille à analyser"
              crossOrigin="anonymous"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-slate-100"
              >
                <Upload className="w-3.5 h-3.5" />
                Changer de photo
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Échantillons rapides pour démonstration jury */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Échantillons prêts pour la présentation :</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_LEAF_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    previewUrl === preset.url
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-center line-clamp-1">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton de lancement */}
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              analyzing
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/25 active:scale-98"
            }`}
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Inférence neuronale en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Lancer l&apos;analyse IA
              </>
            )}
          </button>
        </div>

        {/* Colonne droite : Résultats du diagnostic IA */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                2. Rapport Diagnostic IA
              </h3>
              {analysisResult && (
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {analysisResult.modelUsed === "tensorflow_mobilenet" ? "TensorFlow.js" : "IA Agronomique"}
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-6 pt-4 animate-in fade-in duration-300">
                {/* Diagnostic principal et confiance */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      État diagnostiqué :
                    </span>
                    <span
                      className={`text-sm font-extrabold px-3 py-1 rounded-full border shadow-sm ${
                        DIAGNOSTIC_DETAILS[analysisResult.diagnostic].badgeColor
                      }`}
                    >
                      {analysisResult.labelFr}
                    </span>
                  </div>

                  {/* Barre de niveau de confiance */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Niveau de confiance IA :</span>
                      <span className="text-emerald-700 font-mono text-sm">
                        {analysisResult.confidence} %
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-700"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {DIAGNOSTIC_DETAILS[analysisResult.diagnostic].description}
                  </p>
                </div>

                {/* Recommandation agronomique spécifique */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <h4>Recommandation Immédiate :</h4>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {analysisResult.recommendation}
                  </p>
                </div>

                {/* Métriques spectrales complémentaires */}
                {analysisResult.details && (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Indice Chlorophylle</p>
                      <p className="text-base font-black text-slate-900 mt-1">
                        {analysisResult.details.chlorophyllIndex}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Hydratation Tissu</p>
                      <p className="text-base font-black text-slate-900 mt-1">
                        {analysisResult.details.hydrationScore}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Nécrose Foliaire</p>
                      <p className="text-base font-black text-slate-900 mt-1">
                        {analysisResult.details.necrosisCoverage}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Info className="w-12 h-12 mx-auto opacity-40 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-600">
                  Prêt pour l&apos;analyse.
                </p>
                <p className="text-xs max-w-xs mx-auto text-slate-400">
                  Choisissez une photo et cliquez sur « Lancer l&apos;analyse IA » pour afficher les prédictions du réseau de neurones convolutif.
                </p>
              </div>
            )}
          </div>

          {/* Classes supportées */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-2">5 Classes Reconnaissables :</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">healthy</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold">water_stress</span>
              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[11px] font-semibold">yellow_leaves</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-semibold">disease_spots</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-semibold">wilting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

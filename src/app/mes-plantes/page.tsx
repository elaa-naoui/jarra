"use client";

import React, { useState } from "react";
import {
  Layers,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Thermometer,
  Wind,
  Droplets,
  Calendar,
  Radio,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useJarraStore } from "@/store/useJarraStore";
import { TelemetryCharts } from "@/components/Charts";
import { DIAGNOSTIC_DETAILS } from "@/lib/tfPlantClassifier";
import { Plant, PlantType, IrrigationMethod } from "@/types";

const PLANT_TYPES: PlantType[] = [
  "Tomate",
  "Menthe",
  "Basilic",
  "Persil",
  "Romarin",
  "Laitue",
  "Fraise",
];

const IRRIGATION_METHODS: IrrigationMethod[] = [
  "Jarre enterrée",
  "Hydroponie",
  "Plantes sur le toit",
];

export default function MesPlantesPage() {
  const { plants, measurements, updatePlant, deletePlant } = useJarraStore();

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(plants[0] || null);
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);

  // Champs d'édition
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<PlantType>("Tomate");
  const [editMethod, setEditMethod] = useState<IrrigationMethod>("Jarre enterrée");

  const startEdit = (plant: Plant) => {
    setEditingPlantId(plant.id);
    setEditName(plant.name);
    setEditType(plant.type);
    setEditMethod(plant.irrigation_method);
  };

  const saveEdit = (plantId: string) => {
    updatePlant(plantId, {
      name: editName.trim() || "Plante sans nom",
      type: editType,
      irrigation_method: editMethod,
    });
    setEditingPlantId(null);
    if (selectedPlant?.id === plantId) {
      setSelectedPlant((prev) =>
        prev
          ? {
              ...prev,
              name: editName.trim() || "Plante sans nom",
              type: editType,
              irrigation_method: editMethod,
            }
          : null
      );
    }
  };

  const cancelEdit = () => {
    setEditingPlantId(null);
  };

  const plantMeasurements = measurements.filter(
    (m) => m.plant_id === (selectedPlant?.id || "")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Module 4 • Répertoire Végétal
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Gestion & Suivi de Mes Plantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consultez, modifiez, supprimez et analysez l&apos;historique agronomique complet de chaque pied cultivé.
          </p>
        </div>

        <Link
          href="/plantation"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Ajouter une plante
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Liste des plantes (Cartes) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              Inventaire ({plants.length} plantes)
            </h2>
            <span className="text-xs text-slate-400">Cliquez pour afficher</span>
          </div>

          <div className="space-y-3">
            {plants.map((plant) => {
              const isSelected = selectedPlant?.id === plant.id;
              const isEditing = editingPlantId === plant.id;
              const meta = DIAGNOSTIC_DETAILS[plant.status] || DIAGNOSTIC_DETAILS.healthy;

              return (
                <div
                  key={plant.id}
                  className={`p-4 rounded-2xl border-2 transition-all bg-white ${
                    isSelected
                      ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200/80 hover:border-emerald-300 shadow-sm"
                  }`}
                >
                  {isEditing ? (
                    /* Formulaire d'édition inline */
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500">Nom :</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500">Espèce :</label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as PlantType)}
                            className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-2 py-1.5 bg-slate-50"
                          >
                            {PLANT_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500">Irrigation :</label>
                          <select
                            value={editMethod}
                            onChange={(e) => setEditMethod(e.target.value as IrrigationMethod)}
                            className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-2 py-1.5 bg-slate-50"
                          >
                            {IRRIGATION_METHODS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => saveEdit(plant.id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Carte normale */
                    <div className="flex items-center justify-between gap-3">
                      <div
                        onClick={() => setSelectedPlant(plant)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            plant.photo_url ||
                            "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={plant.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-slate-900 truncate">
                            {plant.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {plant.type} • {plant.season}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {plant.irrigation_method}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${meta.badgeColor}`}
                            >
                              {meta.labelFr}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions carte */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(plant)}
                          title="Modifier nom, type ou méthode"
                          className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlant(plant.id)}
                          title="Supprimer la plante"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Détails de la plante sélectionnée & Historique */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPlant ? (
            <>
              {/* Fiche détaillée */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {selectedPlant.nfc_id}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">
                      {selectedPlant.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enregistré le {new Date(selectedPlant.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <button
                    onClick={() => startEdit(selectedPlant)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                    Modifier cette fiche
                  </button>
                </div>

                {/* Grille des caractéristiques */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-semibold block">Espèce :</span>
                    <strong className="text-sm text-slate-900 mt-0.5 block">
                      {selectedPlant.type}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-semibold block">Saison :</span>
                    <strong className="text-sm text-slate-900 mt-0.5 block capitalize">
                      {selectedPlant.season}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-semibold block">Besoin en Eau :</span>
                    <strong className="text-sm text-slate-900 mt-0.5 block">
                      {selectedPlant.water_need}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-emerald-800 font-semibold block">Méthode active :</span>
                    <strong className="text-sm text-emerald-950 mt-0.5 block">
                      {selectedPlant.irrigation_method}
                    </strong>
                  </div>
                </div>

                {/* État sanitaire & IA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Diagnostic Sanitaire :</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        DIAGNOSTIC_DETAILS[selectedPlant.status].badgeColor
                      }`}
                    >
                      {DIAGNOSTIC_DETAILS[selectedPlant.status].labelFr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {DIAGNOSTIC_DETAILS[selectedPlant.status].recommendation}
                  </p>
                </div>
              </div>

              {/* Graphiques microclimatiques historiques */}
              <TelemetryCharts />
            </>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
              Sélectionnez une plante pour afficher son dossier complet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

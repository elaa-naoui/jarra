import React from "react";
import { WaterNeedCalculator } from "@/components/WaterNeedCalculator";
import { Sprout, HelpCircle, ShieldCheck } from "lucide-react";

export default function PlantationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de page */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          Module 1 • Agronomie Prédictive
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Plantation Immédiate & Choix d&apos;Irrigation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Renseignez le végétal : notre modèle IA calcule le besoin hydrique et recommande la méthode optimale (Jarre enterrée, Hydroponie ou Toiture).
        </p>
      </div>

      {/* Composant interactif du calculateur agronomique */}
      <WaterNeedCalculator />

      {/* Guide méthodologique académique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">
            🏺
          </div>
          <h3 className="text-base font-black text-slate-900">Jarre Enterrée (40 à 69 pts)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Méthode recommandée pour les besoins normaux. L&apos;eau s&apos;infiltre par capillarité à travers l&apos;argile cuite sans évaporation au soleil, économisant 70% d&apos;eau sous climat tunisien.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
            💧
          </div>
          <h3 className="text-base font-black text-slate-900">Hydroponie (&ge; 70 pts)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Méthode préconisée pour les cultures très gourmandes en eau (salades, menthes) par forte chaleur. Circuit fermé continu relié à l&apos;aquarium aquaponique.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
            🌿
          </div>
          <h3 className="text-base font-black text-slate-900">Plantes sur le Toit (&lt; 40 pts)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Idéal pour les plantes rustiques et aromatiques sobres (romarin, thym). Contribue à l&apos;isolation thermique du bâtiment et rafraîchit la toiture.
          </p>
        </div>
      </div>
    </div>
  );
}

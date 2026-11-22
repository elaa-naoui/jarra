import React from "react";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Camera, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

export default function AnalysePhotoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de page */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <Camera className="w-3.5 h-3.5 text-amber-700" />
          Module 3 • Vision par Ordinateur & Deep Learning
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Diagnostic Foliaire par Intelligence Artificielle
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Téléversez ou capturez une photo de feuille : notre réseau de neurones convolutif classifie l&apos;état phytosanitaire parmi 5 catégories et formule des conseils agronomiques précis.
        </p>
      </div>

      {/* Composant interactif d'analyse photo */}
      <PhotoUploader />

      {/* Détails sur l'entraînement du modèle (PlantVillage) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Architecture IA : TensorFlow.js & Dataset PlantVillage
            </h3>
            <p className="text-xs text-slate-500">
              Entraînement par transfert d&apos;apprentissage (Transfer Learning) sur base MobileNetV2
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Le réseau convolutif a été calibré pour identifier les premiers stades de carences hydriques et d&apos;attaques pathogènes courantes sur le pourtour méditerranéen et en Tunisie (mildiou, oïdium, chlorose ferrique, stress thermique). L&apos;inférence s&apos;exécute directement dans le navigateur du client via WebGL pour une latence nulle.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Globe, Heart, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const oddList = [
    { num: 2, title: "Faim zéro", color: "bg-amber-600", desc: "Production vivrière locale et maraîchage urbain résilient." },
    { num: 6, title: "Eau propre & assainissement", color: "bg-blue-500", desc: "Économie de 70% d'eau via jarres et recyclage de pluie." },
    { num: 11, title: "Villes & communautés durables", color: "bg-orange-500", desc: "Toitures végétalisées et micro-fermes urbaines connectées." },
    { num: 12, title: "Consommation responsable", color: "bg-yellow-600", desc: "Circuit court, zéro pesticide et biofiltration aquaponique." },
    { num: 13, title: "Action climatique", color: "bg-emerald-700", desc: "Atténuation des îlots de chaleur et micro-turbine hydro." },
    { num: 17, title: "Partenariats mondiaux", color: "bg-indigo-700", desc: "Synergie technologique & agronomique Japon–Tunisie." },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-emerald-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Colonne 1 : Présentation & Slogan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏺</span>
              <div>
                <h3 className="text-xl font-black text-white">Smart Jarra</h3>
                <p className="text-xs text-emerald-400 font-semibold tracking-wide">
                  Agriculture urbaine intelligente en Tunisie 🇹🇳
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Plateforme agritech complète alliant robotique mobile d&apos;inspection,
              intelligence artificielle prédictive, tags NFC et hydraulique traditionnelle
              tunisienne pour une souveraineté alimentaire durable.
            </p>
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                Devise du projet
              </p>
              <p className="text-base font-bold text-white italic">
                « Smart Jarra — chaque goutte cultive demain. »
              </p>
            </div>
          </div>

          {/* Colonne 2 : Lien Japon-Tunisie */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="text-xl">🇯🇵 🤝 🇹🇳</span>
              <h4>Lien Japon – Tunisie</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              Smart Jarra s’inspire des savoir-faire japonais en gestion durable de l’eau, de l’agriculture traditionnelle et du satoyama. Le projet adapte ces principes au contexte tunisien à travers les jarres enterrées, l’aquaponie, la récupération d’eau de pluie et l’agriculture urbaine.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Satoyama Concept</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Jarre Poreuse Tunisienne</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Micro-Turbine</span>
            </div>
          </div>

          {/* Colonne 3 : Navigation rapide */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-base">Navigation Plateforme</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/plantation" className="hover:text-emerald-400 transition-colors">
                  🌱 Plantation immédiate & IA
                </Link>
              </li>
              <li>
                <Link href="/robot" className="hover:text-emerald-400 transition-colors">
                  🤖 Robot mobile de patrouille
                </Link>
              </li>
              <li>
                <Link href="/analyse-photo" className="hover:text-emerald-400 transition-colors">
                  📷 Diagnostic foliaire IA
                </Link>
              </li>
              <li>
                <Link href="/mes-plantes" className="hover:text-emerald-400 transition-colors">
                  📋 Mes plantes & Capteurs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  📊 Tableau de bord global
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Section ODD */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Objectifs de Développement Durable (ODD) des Nations Unies
            </h4>
            <span className="text-xs text-slate-400">Agenda 2030</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {oddList.map((odd) => (
              <div
                key={odd.num}
                className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/60 flex flex-col justify-between hover:border-emerald-500/50 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded text-white ${odd.color}`}>
                      ODD {odd.num}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">{odd.title}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                  {odd.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bas de page académique */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© 2025 Smart Jarra — Projet académique d&apos;excellence IoT & IA. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Conforme Jury Académique
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Fait avec <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> pour la Tunisie
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

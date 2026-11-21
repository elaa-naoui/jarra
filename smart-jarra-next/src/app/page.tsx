import React from "react";
import Link from "next/link";
import {
  Sprout,
  Bot,
  Camera,
  Layers,
  LayoutDashboard,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  Zap,
  Globe,
  Radio,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { CinematicAnimation } from "@/components/CinematicAnimation";
import { RobotPatrolAnimation } from "@/components/RobotPatrolAnimation";

export default function HomePage() {
  const ctaButtons = [
    {
      title: "Plantation immédiate",
      desc: "Calcul IA du besoin hydrique & saison automatique",
      href: "/plantation",
      icon: Droplets,
      color: "from-emerald-600 to-emerald-800",
      accent: "bg-emerald-50 text-emerald-800",
    },
    {
      title: "Robot mobile",
      desc: "Patrouille virtuelle, scans NFC & prise de vue",
      href: "/robot",
      icon: Bot,
      color: "from-blue-600 to-blue-800",
      accent: "bg-blue-50 text-blue-800",
    },
    {
      title: "Analyse photo",
      desc: "Diagnostic foliaire par IA (5 classes) & TF.js",
      href: "/analyse-photo",
      icon: Camera,
      color: "from-amber-600 to-amber-800",
      accent: "bg-amber-50 text-amber-800",
    },
    {
      title: "Mes plantes",
      desc: "Fiches modifiables, capteurs IoT & historique",
      href: "/mes-plantes",
      icon: Layers,
      color: "from-emerald-700 to-teal-800",
      accent: "bg-teal-50 text-teal-800",
    },
    {
      title: "Tableau de bord",
      desc: "KPIs, graphiques Recharts, alertes & jarres",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "from-slate-800 to-slate-950",
      accent: "bg-slate-100 text-slate-800",
    },
  ];

  const oddDetails = [
    { num: 2, title: "Faim Zéro", desc: "Favorise une agriculture maraîchère urbaine productive et biologique en circuit ultra-court." },
    { num: 6, title: "Eau Propre & Assainissement", desc: "Jusqu'à 70% d'économie d'eau grâce aux jarres souterraines et à la biofiltration." },
    { num: 11, title: "Villes & Communautés Durables", desc: "Végétalisation des toitures tunisiennes et réduction active des îlots de chaleur urbains." },
    { num: 12, title: "Consommation & Production Responsables", desc: "Zéro gaspillage hydrique et réutilisation des déjections aquaponiques comme engrais organique." },
    { num: 13, title: "Action Climatique", desc: "Résilience face aux sécheresses méditerranéennes et micro-génération hydroélectrique." },
    { num: 17, title: "Partenariats pour les Objectifs", desc: "Coopération technologique inspirée des méthodologies satoyama et d'ingénierie tunisienne." },
  ];

  const steps = [
    {
      step: "01",
      title: "Identification NFC",
      desc: "Chaque pot possède une étiquette NFC lue sans contact par le robot mobile ou un smartphone.",
      icon: Radio,
    },
    {
      step: "02",
      title: "Inspection Optique & IoT",
      desc: "Mesure simultanée de la température, hygrométrie de l'air, humidité racinaire et capture photo.",
      icon: Activity,
    },
    {
      step: "03",
      title: "Diagnostic IA & Vision",
      desc: "Le modèle TensorFlow.js détecte l'état foliaire (saine, stress hydrique, feuilles jaunes, maladie, flétrissement).",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Irrigation Ciblée",
      desc: "Recommandation automatique : jarre poreuse enterrée, hydroponie ou culture sur toiture végétalisée.",
      icon: Droplets,
    },
  ];

  const toolsReference = [
    { name: "Supabase React", link: "https://supabase.com/docs/guides/getting-started/quickstarts/reactjs", role: "Base de données relationnelle et authentification cloud" },
    { name: "TensorFlow.js Image Classification", link: "https://www.tensorflow.org/js/tutorials/transfer/image_classification", role: "Inférence neuronale de vision directement dans le navigateur" },
    { name: "PlantVillage Dataset", link: "https://www.tensorflow.org/datasets/catalog/plant_village", role: "Corpus de validation agronomique (feuilles saines et pathologiques)" },
    { name: "Wokwi ESP32", link: "https://wokwi.com/esp32", role: "Simulation électronique virtuelle des capteurs et du microcontrôleur" },
    { name: "CodePen", link: "https://codepen.io/pen/", role: "Bac à sable de test et démonstration de la version HTML autonome" },
    { name: "Vercel", link: "https://vercel.com", role: "Déploiement en production mondialisé avec CDN et HTTPS" },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-card">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Projet Académique d&apos;Excellence 2025 • IoT & IA
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Smart Jarra
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-emerald-200">
                Agriculture urbaine intelligente en Tunisie 🇹🇳
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                Slogan Officiel
              </p>
              <p className="text-lg sm:text-xl font-black italic text-white">
                « Smart Jarra — chaque goutte cultive demain. »
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-2">
              Une plateforme complète mariant l&apos;ancestrale technique des jarres poreuses
              tunisiennes, la robotique mobile d&apos;inspection autonome, l&apos;intelligence
              artificielle de vision par ordinateur et les circuits fermés aquaponiques.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/plantation"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
              >
                Planter avec l&apos;IA
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/robot"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Bot className="w-4 h-4 text-emerald-300" />
                Lancer le Robot
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                Tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CINÉMATIQUE 1 : Animation 3D 20s de l'Écosystème */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <CinematicAnimation />
      </section>

      {/* SECTION CINÉMATIQUE 2 : Animation 3D 15s du Robot Smart Jarra Scout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <RobotPatrolAnimation />
      </section>

      {/* Grille des 5 Modules Principaux */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Modules de la Plateforme</h2>
            <p className="text-sm text-slate-500">
              Accédez directement aux interfaces interactives de démonstration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {ctaButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <Link
                key={btn.href}
                href={btn.href}
                className="group relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${btn.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {btn.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                      {btn.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${btn.accent}`}>
                    Explorer
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section : Lien Japon–Tunisie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 p-8 sm:p-12 border border-emerald-100/80 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-sm">
                <span className="text-base">🇯🇵 🤝 🇹🇳</span>
                Convergence Culturelle & Technologique
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Lien Japon – Tunisie : L&apos;Inspiration Satoyama
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                « Smart Jarra s’inspire des savoir-faire japonais en gestion durable de l’eau, de l’agriculture traditionnelle et du satoyama. Le projet adapte ces principes au contexte tunisien à travers les jarres enterrées, l’aquaponie, la récupération d’eau de pluie et l’agriculture urbaine. »
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">Satoyama Japonais</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Harmonie entre biodiversité, micro-bassins et zones habitées.</p>
                </div>
                <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">Jarres Tunisiennes</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Terre cuite poreuse millénaire éliminant l&apos;évaporation en surface.</p>
                </div>
                <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">Énergie & Eau</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Micro-turbine couplée au réseau gravitaire et à la noria de puits.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-6 rounded-3xl bg-white border border-slate-200 shadow-card text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-4xl shadow-md">
                  🏺
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">La Jarre Tunisienne</h3>
                  <p className="text-xs text-slate-500 mt-1">Pot d&apos;irrigation souterraine microporeux à débit auto-régulé par la succion des racines.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                  💧 70% d&apos;économie d&apos;eau mesurée
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Fonctionnement du Système */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Fonctionnement du Système</h2>
          <p className="text-sm text-slate-500">
            Une chaîne continue allant de la lecture d&apos;étiquette à l&apos;irrigation ciblée
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 relative overflow-hidden"
              >
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-4 -z-0">
                  {st.step}
                </span>
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="relative z-10 space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section : Objectifs de Développement Durable (ODD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" /> Impact & Alignement Mondial
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Contribution aux ODD des Nations Unies (Agenda 2030)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200/70 text-slate-700">
            6 ODD Clés Adressés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oddDetails.map((odd) => (
            <div
              key={odd.num}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3 hover:border-emerald-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  #{odd.num}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ODD {odd.num}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">{odd.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {odd.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section : Table des Outils et Références Académiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Écosystème d&apos;Outils & Références Techniques</h2>
          <p className="text-sm text-slate-500">
            Composants officiels utilisés pour l&apos;architecture, la base de données, l&apos;IA et la simulation
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-3.5 px-6">Outil</th>
                  <th className="py-3.5 px-6">Rôle dans le projet</th>
                  <th className="py-3.5 px-6 text-right">Lien de documentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {toolsReference.map((tool, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      {tool.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{tool.role}</td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold transition-all"
                      >
                        <span>Consulter</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

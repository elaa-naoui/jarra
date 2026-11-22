"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface EcosystemStep {
  id: number;
  image: string;
  alt: string;
  label: string;
  caption: string;
  color: string;          // gradient classes for the step badge
  animation: "fade-scale" | "slide-left" | "slide-right" | "fade-up";
}

const STEPS: EcosystemStep[] = [
  {
    id: 1,
    image: "/goutte-eau-smart-jarra.jpg",
    alt: "Une goutte d'eau – point de départ du cycle Smart Jarra",
    label: "1. La Goutte d'Eau",
    caption:
      "Tout commence par une seule goutte. L'eau de pluie est captée, filtrée et distribuée intelligemment à travers l'écosystème Smart Jarra.",
    color: "from-blue-600 to-cyan-700",
    animation: "fade-scale",
  },
  {
    id: 2,
    image: "/toit-vegetalise-tunisie.jpg",
    alt: "Toit végétalisé d'une maison tunisienne avec gouttière",
    label: "2. Toit Végétalisé & Gouttière",
    caption:
      "Le toit vert absorbe les eaux de ruissellement, réduit les îlots de chaleur urbains et achemine chaque litre d'eau de pluie vers les filtres naturels.",
    color: "from-emerald-600 to-green-700",
    animation: "slide-left",
  },
  {
    id: 3,
    image: "/gouttiere-filtre-eau-pluie.jpg",
    alt: "Gouttière avec filtre naturel pour eau de pluie",
    label: "3. Filtration Naturelle",
    caption:
      "Un filtre à sable et graviers épure l'eau avant qu'elle n'atteigne le réservoir ou l'aquarium biologique, garantissant une qualité optimale pour les plantes.",
    color: "from-teal-600 to-emerald-700",
    animation: "slide-right",
  },
  {
    id: 4,
    image: "/reservoir-eau-pluie-transparent.jpg",
    alt: "Réservoir d'eau de pluie transparent avec jauges",
    label: "4. Réservoir & Jarres Enterrées",
    caption:
      "L'eau stockée alimente les jarres tunisiennes en terre cuite enterrées au pied des racines. Un mécanisme de succion racinaire auto-régule l'irrigation — 70 % d'eau économisée.",
    color: "from-amber-600 to-orange-700",
    animation: "fade-up",
  },
];

// ─── Hook : observe a single element ──────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el); // fire once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Animation classes by type ─────────────────────────────────────────────────
function getAnimClasses(type: EcosystemStep["animation"], inView: boolean): string {
  const base = "transition-all duration-700 ease-out";

  if (!inView) {
    switch (type) {
      case "fade-scale":  return `${base} opacity-0 scale-90`;
      case "slide-left":  return `${base} opacity-0 -translate-x-20`;
      case "slide-right": return `${base} opacity-0 translate-x-20`;
      case "fade-up":     return `${base} opacity-0 translate-y-16`;
    }
  }
  return `${base} opacity-100 translate-x-0 translate-y-0 scale-100`;
}

// ─── Single Step Card ──────────────────────────────────────────────────────────
function EcosystemCard({ step, index }: { step: EcosystemStep; index: number }) {
  const { ref, inView } = useInView(0.15);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      } gap-8 lg:gap-14 items-center`}
    >
      {/* Image side */}
      <div className={`w-full lg:w-7/12 ${getAnimClasses(step.animation, inView)}`}>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 aspect-video group">
          <Image
            src={step.image}
            alt={step.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={index === 0}
          />
          {/* Subtle overlay gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent pointer-events-none" />

          {/* Step badge on image */}
          <div
            className={`absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r ${step.color} text-white text-xs font-black shadow-lg`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
            {step.label}
          </div>
        </div>
      </div>

      {/* Text side */}
      <div
        className={`w-full lg:w-5/12 space-y-5 ${getAnimClasses(
          isEven ? "slide-right" : "slide-left",
          inView
        )}`}
        style={{ transitionDelay: inView ? "180ms" : "0ms" }}
      >
        {/* Decorative step number */}
        <div
          className={`text-8xl font-black leading-none select-none bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-20`}
        >
          0{step.id}
        </div>

        <div className="-mt-10 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {step.label}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {step.caption}
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 pt-2">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s.id === step.id
                    ? `w-8 bg-gradient-to-r ${step.color}`
                    : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Connector line between cards ─────────────────────────────────────────────
function Connector() {
  const { ref, inView } = useInView(0.3);
  return (
    <div ref={ref} className="flex justify-center">
      <div
        className={`w-px transition-all duration-700 ease-out bg-gradient-to-b from-emerald-300 to-blue-300 ${
          inView ? "h-20 opacity-100" : "h-0 opacity-0"
        }`}
      />
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader() {
  const { ref, inView } = useInView(0.3);
  return (
    <div
      ref={ref}
      className={`text-center space-y-4 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-800">
        <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Apparition Progressive — Faites défiler pour découvrir
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
        L&apos;Écosystème Smart Jarra
      </h2>
      <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
        De la première goutte d&apos;eau jusqu&apos;aux jarres enterrées — chaque
        composant du cycle intelligent apparaît à mesure que vous explorez la page.
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function ScrollRevealEcosystem() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      <SectionHeader />

      <div className="space-y-8">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <EcosystemCard step={step} index={i} />
            {i < STEPS.length - 1 && <Connector />}
          </React.Fragment>
        ))}
      </div>

      {/* Final CTA after last image */}
      <FinalReveal />
    </section>
  );
}

// ─── Final reveal block ───────────────────────────────────────────────────────
function FinalReveal() {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="text-5xl">🏺💧🤖</div>
          <h3 className="text-2xl sm:text-3xl font-black">
            L&apos;écosystème complet est en place !
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Jarres enterrées, aquaponie, robot mobile IA, récupération d&apos;eau de
            pluie, énergie solaire et micro-turbine hydraulique — tout est connecté.
          </p>
          <div className="pt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30">
            <span>« Smart Jarra — chaque goutte cultive demain. »</span>
          </div>
        </div>
      </div>
    </div>
  );
}

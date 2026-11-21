"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Bot,
  Camera,
  Layers,
  LayoutDashboard,
  Droplets,
  Bell,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import { useJarraStore } from "@/store/useJarraStore";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const alerts = useJarraStore((s) => s.alerts);
  const isRealModelActive = useJarraStore((s) => s.isRealModelActive);
  const toggleRealModel = useJarraStore((s) => s.toggleRealModel);

  const navLinks = [
    { href: "/", label: "Accueil", icon: Sprout },
    { href: "/plantation", label: "Plantation immédiate", icon: Droplets },
    { href: "/robot", label: "Robot mobile", icon: Bot },
    { href: "/analyse-photo", label: "Analyse photo", icon: Camera },
    { href: "/mes-plantes", label: "Mes plantes", icon: Layers },
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Slogan */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🏺</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-emerald-900">
                  Smart<span className="text-emerald-600 font-extrabold">Jarra</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Tunisie 🇹🇳
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-700/80 hidden sm:block">
                Chaque goutte cultive demain
              </p>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/30"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions & Model Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleRealModel}
              title="Basculer entre simulation IA et modèle TensorFlow.js PlantVillage"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isRealModelActive
                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${isRealModelActive ? "text-blue-600 animate-pulse" : ""}`} />
              <span>{isRealModelActive ? "TF.js Actif" : "Simulation IA"}</span>
            </button>

            <Link
              href="/dashboard#alertes"
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 transition-colors"
              title="Alertes actives"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {alerts.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "text-slate-700 hover:bg-emerald-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                toggleRealModel();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
            >
              <Cpu className="w-4 h-4" />
              <span>{isRealModelActive ? "Modèle TF.js Actif" : "Simulation IA"}</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">Smart Jarra 2025</span>
          </div>
        </div>
      )}
    </header>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Download,
  Sparkles,
  Layers,
  Bot,
  Droplets,
  Sun,
  Waves,
  Eye,
} from "lucide-react";

interface StepMarker {
  time: number;
  label: string;
  icon: string;
  desc: string;
}

const TIMELINE_STEPS: StepMarker[] = [
  { time: 0, label: "Goutte d'eau", icon: "💧", desc: "La goutte d'eau primordiale en lévitation macro (« chaque goutte cultive demain »)." },
  { time: 2.5, label: "Toit & Gouttière", icon: "🏠", desc: "Maison tunisienne moderne avec toit végétalisé et gouttière profilée." },
  { time: 5.0, label: "Filtre & Réservoir", icon: "🌧️", desc: "Filtre naturel transparent et grand réservoir d'eau de pluie connecté." },
  { time: 7.5, label: "Aquarium Aquaponique", icon: "🐟", desc: "Bassin avec poissons Tilapias et filtre biologique nitrifiant." },
  { time: 10.0, label: "Jarres Enterrées & Racines", icon: "🏺", desc: "Coupe souterraine des jarres en terre cuite poreuses et chevelu racinaire." },
  { time: 12.5, label: "Jardin & Végétaux", icon: "🌿", desc: "Pots de menthe, tomates et aromates hydratés par capillarité." },
  { time: 15.0, label: "Robot Mobile & Caméra IA", icon: "🤖", desc: "Le rover JarraBot Scout s'avance au centre avec sa caméra IA et capteurs." },
  { time: 17.5, label: "Puits, Turbine & Énergie", icon: "⚡", desc: "Puits avec noria à godets, micro-turbine, panneau solaire et parasol." },
  { time: 20.0, label: "Scène Complète Écosystème", icon: "✨", desc: "Vue cinématographique globale ensoleillée avec le robot au centre." },
];

export const CinematicAnimation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 à 20 secondes
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Images préchargées pour le rendu cinématique
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const urls: Record<string, string> = {
      goutte: "/goutte-eau-smart-jarra.jpg",
      toit: "/toit-vegetalise-tunisie.jpg",
      filtre: "/gouttiere-filtre-eau-pluie.jpg",
      reservoir: "/reservoir-eau-pluie-transparent.jpg",
    };

    Object.entries(urls).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      imagesRef.current[key] = img;
    });
  }, []);

  // Boucle de rendu Canvas cinématique 16:9
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Rendu d'une frame à un instant t (0s à 20s)
    const renderFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Fond de base méditerranéen ciel / soleil
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#0284c7");
      skyGrad.addColorStop(0.5, "#7dd3fc");
      skyGrad.addColorStop(0.8, "#fef08a");
      skyGrad.addColorStop(1, "#f4f7f4");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // --- PHASE 1 (0s à 2.5s) : La Goutte d'eau macro ---
      if (t < 3.0) {
        const dropOpacity = t < 2.2 ? 1 : Math.max(0, 1 - (t - 2.2) / 0.8);
        ctx.save();
        ctx.globalAlpha = dropOpacity;

        // Fond sombre stylé pour la goutte macro
        const darkGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5);
        darkGrad.addColorStop(0, "#064e3b");
        darkGrad.addColorStop(0.6, "#0f172a");
        darkGrad.addColorStop(1, "#020617");
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, 0, width, height);

        // Halo lumineux
        const haloGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, 200);
        haloGrad.addColorStop(0, "rgba(52, 211, 153, 0.4)");
        haloGrad.addColorStop(1, "rgba(52, 211, 153, 0)");
        ctx.fillStyle = haloGrad;
        ctx.fillRect(0, 0, width, height);

        // Dessin de la goutte 3D en lévitation
        const dropY = height / 2 + Math.sin(t * 3) * 12;
        ctx.save();
        ctx.translate(width / 2, dropY);
        ctx.scale(1 + Math.sin(t * 2) * 0.05, 1 + Math.cos(t * 2) * 0.05);

        // Corps de la goutte
        ctx.beginPath();
        ctx.moveTo(0, -90);
        ctx.bezierCurveTo(40, -40, 75, 20, 60, 65);
        ctx.bezierCurveTo(45, 105, -45, 105, -60, 65);
        ctx.bezierCurveTo(-75, 20, -40, -40, 0, -90);
        ctx.closePath();

        const dropGrad = ctx.createLinearGradient(-40, -80, 40, 90);
        dropGrad.addColorStop(0, "#a7f3d0");
        dropGrad.addColorStop(0.4, "#38bdf8");
        dropGrad.addColorStop(0.8, "#059669");
        dropGrad.addColorStop(1, "#0284c7");
        ctx.fillStyle = dropGrad;
        ctx.fill();

        // Reflet spéculaire
        ctx.beginPath();
        ctx.ellipse(-20, -20, 15, 30, Math.PI / 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();

        // Ondelettes concentriques de chute
        ctx.beginPath();
        ctx.ellipse(0, 130, 100 * (t % 1.5), 25 * (t % 1.5), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110, 231, 183, ${1 - (t % 1.5) / 1.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Titre d'amorce
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 32px Poppins, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Smart Jarra", width / 2, height / 2 + 180);
        ctx.font = "600 18px Inter, sans-serif";
        ctx.fillStyle = "#6ee7b7";
        ctx.fillText("« Chaque goutte cultive demain »", width / 2, height / 2 + 215);

        ctx.restore();
      }

      // --- PHASES 2 à 8 (t >= 2.0s) : Assemblage progressif du système ---
      if (t >= 2.0) {
        const sceneOpacity = Math.min(1, (t - 2.0) / 0.8);
        ctx.save();
        ctx.globalAlpha = sceneOpacity;

        // Sol du patio tunisien (dalles de grès ocre / terracotta)
        const groundY = height * 0.68;
        const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
        groundGrad.addColorStop(0, "#e2e8f0");
        groundGrad.addColorStop(0.3, "#f8fafc");
        groundGrad.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, groundY, width, height - groundY);

        // Lignes de carrelage en perspective
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 1.5;
        for (let x = -200; x < width + 400; x += 90) {
          ctx.beginPath();
          ctx.moveTo(x, groundY);
          ctx.lineTo(x + (x - width / 2) * 0.8, height);
          ctx.stroke();
        }

        // --- 1. Maison tunisienne blanche au second plan (apparaît à t >= 2.5s) ---
        if (t >= 2.5) {
          const houseProgress = Math.min(1, (t - 2.5) / 1.5);
          ctx.save();
          ctx.globalAlpha = houseProgress;
          const houseX = 60;
          const houseY = groundY - 260;
          const houseW = 340;
          const houseH = 260;

          // Corps de maison à la chaux blanche
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(0,0,0,0.12)";
          ctx.shadowBlur = 20;
          ctx.fillRect(houseX, houseY, houseW, houseH);
          ctx.shadowBlur = 0;

          // Parapet & toit végétalisé (herbes aromatiques vertes)
          ctx.fillStyle = "#15803d";
          ctx.fillRect(houseX - 10, houseY - 20, houseW + 20, 24);

          // Buissons d'herbes sur le toit
          for (let i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.arc(houseX + 15 + i * 38, houseY - 24, 16 + (i % 3) * 4, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? "#16a34a" : "#22c55e";
            ctx.fill();
          }

          // Porte tunisienne voûtée bleue & fenêtres en fer forgé
          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.arc(houseX + houseW / 2, houseY + houseH - 90, 36, Math.PI, 0);
          ctx.rect(houseX + houseW / 2 - 36, houseY + houseH - 90, 72, 90);
          ctx.fill();

          // Fenêtre à moucharabieh
          ctx.fillStyle = "#0369a1";
          ctx.fillRect(houseX + 45, houseY + 60, 48, 60);
          ctx.fillRect(houseX + houseW - 93, houseY + 60, 48, 60);

          ctx.restore();
        }

        // --- 2. Gouttière & Descente pluviale (apparaît à t >= 3.5s) ---
        if (t >= 3.5) {
          const gutProgress = Math.min(1, (t - 3.5) / 1.2);
          ctx.save();
          ctx.globalAlpha = gutProgress;
          const gutterX = 400;
          const gutterTop = groundY - 280;

          // Gouttière horizontale
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(50, gutterTop);
          ctx.lineTo(gutterX, gutterTop);
          ctx.stroke();

          // Descente verticale
          ctx.beginPath();
          ctx.moveTo(gutterX, gutterTop);
          ctx.lineTo(gutterX, groundY - 90);
          ctx.stroke();

          // Eau animée qui coule dans la descente
          ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 10]);
          ctx.lineDashOffset = -t * 40;
          ctx.beginPath();
          ctx.moveTo(gutterX, gutterTop);
          ctx.lineTo(gutterX, groundY - 90);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.restore();
        }

        // --- 3. Filtre naturel & Grand Réservoir Transparent (apparaît à t >= 5.0s) ---
        if (t >= 5.0) {
          const tankProgress = Math.min(1, (t - 5.0) / 1.5);
          ctx.save();
          ctx.globalAlpha = tankProgress;
          const tankX = 420;
          const tankY = groundY - 140;
          const tankW = 110;
          const tankH = 140;

          // Cuve transparente
          ctx.fillStyle = "rgba(224, 242, 254, 0.4)";
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 3;
          ctx.strokeRect(tankX, tankY, tankW, tankH);
          ctx.fillRect(tankX, tankY, tankW, tankH);

          // Niveau d'eau dynamique à l'intérieur
          const waterFill = Math.min(0.8, 0.3 + (t - 5.0) * 0.1);
          const waterH = tankH * waterFill;
          const waterGrad = ctx.createLinearGradient(0, tankY + tankH - waterH, 0, tankY + tankH);
          waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.7)");
          waterGrad.addColorStop(1, "rgba(2, 132, 199, 0.85)");
          ctx.fillStyle = waterGrad;
          ctx.fillRect(tankX + 4, tankY + tankH - waterH, tankW - 8, waterH);

          // Capteur IoT ultrasonique sommital (lumière cyan)
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(tankX + tankW / 2 - 12, tankY - 12, 24, 12);
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(tankX + tankW / 2, tankY - 6, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // --- 4. Aquarium Aquaponique & Poissons (apparaît à t >= 7.0s) ---
        if (t >= 7.0) {
          const aqProgress = Math.min(1, (t - 7.0) / 1.5);
          ctx.save();
          ctx.globalAlpha = aqProgress;
          const aqX = 560;
          const aqY = groundY - 100;
          const aqW = 120;
          const aqH = 100;

          // Verre aquarium
          ctx.fillStyle = "rgba(186, 230, 253, 0.35)";
          ctx.strokeStyle = "#0ea5e9";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(aqX, aqY, aqW, aqH);
          ctx.fillRect(aqX, aqY, aqW, aqH);

          // Eau bleutée et plantes immergées
          ctx.fillStyle = "rgba(14, 165, 233, 0.25)";
          ctx.fillRect(aqX + 3, aqY + 15, aqW - 6, aqH - 18);

          // Poissons animés
          for (let f = 0; f < 3; f++) {
            const fishX = aqX + 25 + ((t * 25 + f * 35) % (aqW - 50));
            const fishY = aqY + 40 + f * 18 + Math.sin(t * 4 + f) * 5;
            ctx.fillStyle = "#f97316";
            ctx.beginPath();
            ctx.ellipse(fishX, fishY, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Nageoire
            ctx.beginPath();
            ctx.moveTo(fishX - 7, fishY);
            ctx.lineTo(fishX - 12, fishY - 4);
            ctx.lineTo(fishX - 12, fishY + 4);
            ctx.fill();
          }

          // Filtre biologique supérieur avec plantes enracinées
          ctx.fillStyle = "#334155";
          ctx.fillRect(aqX + 10, aqY - 15, aqW - 20, 16);
          // Feuilles vertes émergeant
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(aqX + 35, aqY - 22, 12, 0, Math.PI * 2);
          ctx.arc(aqX + 60, aqY - 26, 14, 0, Math.PI * 2);
          ctx.arc(aqX + 85, aqY - 22, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // --- 5. Coupe Souterraine des Jarres Enterrées & Racines (apparaît à t >= 9.0s) ---
        if (t >= 9.0) {
          const jarProgress = Math.min(1, (t - 9.0) / 1.5);
          ctx.save();
          ctx.globalAlpha = jarProgress;

          // Coupe de terreau brun sous le sol à droite
          const cutX = width - 420;
          const cutY = groundY + 10;
          const cutW = 390;
          const cutH = height - groundY - 20;

          ctx.fillStyle = "#451a03";
          ctx.fillRect(cutX, cutY, cutW, cutH);

          // Jarre poreuse en terre cuite terracotta
          const jarCenterX = cutX + 180;
          const jarCenterY = cutY + 65;

          ctx.fillStyle = "#d84315";
          ctx.strokeStyle = "#bf360c";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(jarCenterX, jarCenterY, 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Goulot de la jarre affleurant le sol
          ctx.fillRect(jarCenterX - 14, jarCenterY - 55, 28, 20);

          // Eau à l'intérieur
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(jarCenterX, jarCenterY + 10, 24, 0, Math.PI * 2);
          ctx.fill();

          // Suintement capillaire d'eau (petits points bleus émettant)
          ctx.fillStyle = "#7dd3fc";
          for (let dot = 0; dot < 8; dot++) {
            const angle = (dot * Math.PI) / 4 + t;
            const r = 46 + Math.sin(t * 3 + dot) * 6;
            ctx.beginPath();
            ctx.arc(jarCenterX + Math.cos(angle) * r, jarCenterY + Math.sin(angle) * r, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Chevelu racinaire blanc/doré attirant l'eau
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 1.5;
          for (let r = 0; r < 6; r++) {
            ctx.beginPath();
            ctx.moveTo(cutX + 60 + r * 50, cutY);
            ctx.quadraticCurveTo(
              jarCenterX + (r - 3) * 15,
              jarCenterY + (r % 2) * 20,
              jarCenterX + Math.cos(r) * 35,
              jarCenterY + Math.sin(r) * 35
            );
            ctx.stroke();
          }

          // Pots de légumes au-dessus du sol (Tomate, Menthe)
          ctx.fillStyle = "#ea580c";
          ctx.fillRect(cutX + 130, groundY - 50, 100, 50);
          // Feuillage tomate
          ctx.fillStyle = "#16a34a";
          ctx.beginPath();
          ctx.arc(cutX + 180, groundY - 70, 36, 0, Math.PI * 2);
          ctx.fill();
          // Tomates rouges
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(cutX + 165, groundY - 60, 8, 0, Math.PI * 2);
          ctx.arc(cutX + 195, groundY - 65, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // --- 6. Puits traditionnel & Roue à Godets Noria + Micro-Turbine (apparaît à t >= 12.0s) ---
        if (t >= 12.0) {
          const wellProgress = Math.min(1, (t - 12.0) / 1.5);
          ctx.save();
          ctx.globalAlpha = wellProgress;
          const wellX = 720;
          const wellY = groundY - 120;

          // Margelle de puits en pierre
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(wellX - 35, groundY - 50, 70, 50);

          // Roue à godets tournante
          ctx.save();
          ctx.translate(wellX, wellY + 20);
          ctx.rotate(t * 1.8);
          ctx.strokeStyle = "#b45309";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, 32, 0, Math.PI * 2);
          ctx.stroke();

          // Rayons et godets
          for (let g = 0; g < 6; g++) {
            const ga = (g * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ga) * 32, Math.sin(ga) * 32);
            ctx.stroke();

            // Godet
            ctx.fillStyle = "#d97706";
            ctx.fillRect(Math.cos(ga) * 32 - 5, Math.sin(ga) * 32 - 5, 10, 10);
          }
          ctx.restore();

          // Micro-turbine hydraulique (rotor vert/bleu tournant)
          const turbX = 810;
          const turbY = groundY - 60;
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(turbX - 16, turbY - 16, 32, 32);
          ctx.save();
          ctx.translate(turbX, turbY);
          ctx.rotate(-t * 5);
          ctx.fillStyle = "#10b981";
          for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillRect(0, -3, 14, 6);
          }
          ctx.restore();

          // Petit Panneau Solaire orienté
          ctx.fillStyle = "#1e3a8a";
          ctx.save();
          ctx.translate(720, groundY - 190);
          ctx.rotate(-0.25);
          ctx.fillRect(-35, -20, 70, 40);
          ctx.strokeStyle = "#93c5fd";
          ctx.lineWidth = 1;
          ctx.strokeRect(-35, -20, 70, 40);
          ctx.restore();

          ctx.restore();
        }

        // --- 7. Parasol Réversible Protecteur (apparaît à t >= 13.5s) ---
        if (t >= 13.5) {
          const paraProgress = Math.min(1, (t - 13.5) / 1.5);
          ctx.save();
          ctx.globalAlpha = paraProgress;

          const px = 280;
          const py = groundY - 200;
          // Mât
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(px, groundY);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Toile déployée incurvée
          ctx.fillStyle = "#f8fafc";
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px - 90, py + 20);
          ctx.quadraticCurveTo(px, py - 40, px + 90, py + 20);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }

        // --- 8. ROBOT MOBILE AU CENTRE (apparaît à t >= 14.5s et s'avance) ---
        if (t >= 14.5) {
          const robotProgress = Math.min(1, (t - 14.5) / 1.8);
          ctx.save();
          ctx.globalAlpha = robotProgress;

          // Déplacement vers le centre
          const startX = 180;
          const targetX = width / 2 - 40;
          const rx = startX + (targetX - startX) * robotProgress;
          const ry = groundY - 35;

          // Ombre au sol
          ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
          ctx.beginPath();
          ctx.ellipse(rx + 45, groundY + 5, 55, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          // Deux roues tout-terrain crantées
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(rx + 5, ry + 10, 18, 32);
          ctx.fillRect(rx + 67, ry + 10, 18, 32);

          // Châssis blanc et vert épuré
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(rx + 15, ry - 35, 60, 48, [12]);
          ctx.fill();
          ctx.stroke();

          // Bandeau vert émeraude
          ctx.fillStyle = "#10b981";
          ctx.fillRect(rx + 15, ry - 15, 60, 10);

          // Écran digital avant
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.roundRect(rx + 23, ry - 30, 44, 18, [4]);
          ctx.fill();

          // Yeux / Caméra IA sur l'écran
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(rx + 36, ry - 21, 4, 0, Math.PI * 2);
          ctx.arc(rx + 54, ry - 21, 4, 0, Math.PI * 2);
          ctx.fill();

          // Tourelle Caméra Spectrale IA au sommet
          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.arc(rx + 45, ry - 42, 9, 0, Math.PI * 2);
          ctx.fill();

          // Faisceau de scan spectral orienté vers les plantes
          const beamGrad = ctx.createLinearGradient(rx + 45, ry - 42, rx + 140, ry - 10);
          beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.6)");
          beamGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(rx + 45, ry - 42);
          ctx.lineTo(rx + 140, ry - 45);
          ctx.lineTo(rx + 130, ry + 15);
          ctx.closePath();
          ctx.fill();

          // Antenne NFC & voyant clignotant
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(rx + 25, ry - 35);
          ctx.lineTo(rx + 20, ry - 55);
          ctx.stroke();
          ctx.fillStyle = Math.sin(t * 8) > 0 ? "#10b981" : "#ef4444";
          ctx.beginPath();
          ctx.arc(rx + 20, ry - 57, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        ctx.restore();
      }

      // Indicateur visuel de temps (overlay discret)
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.fillRect(20, 20, 160, 36);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Poppins, monospace";
      ctx.textAlign = "left";
      ctx.fillText(`⏱ ${t.toFixed(1)}s / 20.0s`, 32, 43);
    };

    renderFrame(currentTime);
  }, [currentTime]);

  // Gestion du chrono de lecture automatique (20s)
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= 20.0) {
          setIsPlaying(false);
          return 20.0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentTime >= 20) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Enregistrement vidéo WebM / MP4 via Canvas MediaRecorder
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      mediaRecorder?.stop();
      setIsRecording(false);
      return;
    }

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smart-jarra-animation-20s.webm";
      a.click();
    };

    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const activeStep = TIMELINE_STEPS.slice().reverse().find((s) => currentTime >= s.time) || TIMELINE_STEPS[0];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Animation 3D Cinématique • 20 Secondes
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-poppins">
            Apparition Progressive de l&apos;Écosystème Smart Jarra
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Séquence chronologique complète : de la goutte d&apos;eau originelle à la scène globale avec le robot au centre.
          </p>
        </div>

        {/* Bouton d'export vidéo */}
        <button
          onClick={handleRecordVideo}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
            isRecording
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
          }`}
        >
          <Download className="w-4 h-4" />
          {isRecording ? "Enregistrement vidéo en cours..." : "Exporter la vidéo (.webm)"}
        </button>
      </div>

      {/* Écran Cinématique 16:9 */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border-4 border-slate-900 group">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain"
        />

        {/* Badge descriptif de l'étape active */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white text-xs max-w-md shadow-lg pointer-events-none transition-all">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <span>{activeStep.icon}</span>
            <span>{activeStep.label}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {activeStep.desc}
          </p>
        </div>

        {/* Overlay lecture au survol */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>
        </div>
      </div>

      {/* Barre de timeline & contrôles de lecture */}
      <div className="space-y-4 pt-2">
        {/* Curseur Scrubber 0 à 20s */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
            <span>00:00</span>
            <span className="text-emerald-700 font-black">
              {currentTime.toFixed(1)}s / 20.0s
            </span>
            <span>00:20</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.05"
            value={currentTime}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentTime(parseFloat(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Boutons de contrôle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              {isPlaying ? "Pause" : currentTime >= 20 ? "Recommencer" : "Lire l'animation (20s)"}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Marqueurs d'étapes cliquables */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TIMELINE_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTime(s.time);
                }}
                title={`${s.time}s : ${s.label}`}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  currentTime >= s.time && (idx === TIMELINE_STEPS.length - 1 || currentTime < TIMELINE_STEPS[idx + 1].time)
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {s.icon} {s.time}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Bot,
  Radio,
  Camera,
  Activity,
  Sparkles,
  Droplets,
} from "lucide-react";

interface PatrolPlant {
  name: string;
  type: string;
  nfc: string;
  x: number; // position x sur le canvas
  status: string;
  temp: number;
  airHum: number;
  soilHum: number;
  recommendation: string;
  icon: string;
}

const PATROL_PLANTS: PatrolPlant[] = [
  {
    name: "Menthe Verte",
    type: "Menthe",
    nfc: "NFC-TUN-002",
    x: 280,
    status: "healthy",
    temp: 24.2,
    airHum: 58,
    soilHum: 68,
    recommendation: "Irrigation optimale par jarre poreuse.",
    icon: "🌿",
  },
  {
    name: "Basilic Grand Vert",
    type: "Basilic",
    nfc: "NFC-TUN-003",
    x: 640,
    status: "water_stress",
    temp: 28.5,
    airHum: 42,
    soilHum: 32,
    recommendation: "Stress hydrique détecté : recharge d'eau urgente.",
    icon: "🌱",
  },
  {
    name: "Tomate Cerise",
    type: "Tomate",
    nfc: "NFC-TUN-001",
    x: 1000,
    status: "healthy",
    temp: 25.1,
    airHum: 54,
    soilHum: 64,
    recommendation: "Turgescence foliaire normale.",
    icon: "🍅",
  },
];

export const RobotPatrolAnimation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 à 15s
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Rendu de la frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.72;

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Ciel méditerranéen & lumière douce
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#38bdf8");
      skyGrad.addColorStop(0.6, "#bae6fd");
      skyGrad.addColorStop(0.85, "#fef3c7");
      skyGrad.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Mur de fond blanchi à la chaux avec vigne vierge et poteries
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, groundY - 240, width, 240);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1;
      for (let y = groundY - 220; y < groundY; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sol du jardin (dalles et terre cuite)
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
      groundGrad.addColorStop(0, "#cbd5e1");
      groundGrad.addColorStop(0.2, "#e2e8f0");
      groundGrad.addColorStop(1, "#94a3b8");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Ligne de guidage optique au sol
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(0, groundY + 45);
      ctx.lineTo(width, groundY + 45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dessin des 3 pots de plantes (Menthe, Basilic, Tomate)
      PATROL_PLANTS.forEach((p, idx) => {
        // Pot en terre cuite
        const potW = 90;
        const potH = 75;
        const potX = p.x - potW / 2;
        const potY = groundY - potH;

        // Ombre sous le pot
        ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
        ctx.beginPath();
        ctx.ellipse(p.x, groundY + 8, 55, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corps du pot en terracotta
        const potGrad = ctx.createLinearGradient(potX, potY, potX + potW, potY);
        potGrad.addColorStop(0, "#c2410c");
        potGrad.addColorStop(0.5, "#ea580c");
        potGrad.addColorStop(1, "#9a3412");
        ctx.fillStyle = potGrad;
        ctx.beginPath();
        ctx.moveTo(potX, potY);
        ctx.lineTo(potX + potW, potY);
        ctx.lineTo(potX + potW - 12, potY + potH);
        ctx.lineTo(potX + 12, potY + potH);
        ctx.closePath();
        ctx.fill();

        // Rebord supérieur du pot
        ctx.fillStyle = "#7c2d12";
        ctx.fillRect(potX - 5, potY - 8, potW + 10, 10);

        // Étiquette NFC virtuelle sur le flanc du pot
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.roundRect(p.x - 18, potY + 25, 36, 22, [4]);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Symbole d'onde NFC
        ctx.beginPath();
        ctx.arc(p.x, potY + 36, 6, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();

        // Végétation luxuriante
        if (p.type === "Menthe") {
          ctx.fillStyle = "#15803d";
          for (let m = 0; m < 7; m++) {
            ctx.beginPath();
            ctx.arc(p.x - 30 + m * 10, potY - 20 - (m % 3) * 10, 16, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.type === "Basilic") {
          ctx.fillStyle = p.status === "water_stress" ? "#65a30d" : "#16a34a";
          for (let b = 0; b < 6; b++) {
            ctx.beginPath();
            ctx.arc(p.x - 25 + b * 10, potY - 25 - (b % 2) * 12, 18, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Tomate avec fruits
          ctx.fillStyle = "#166534";
          ctx.beginPath();
          ctx.arc(p.x, potY - 45, 42, 0, Math.PI * 2);
          ctx.fill();
          // Fruits rouges
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(p.x - 16, potY - 35, 10, 0, Math.PI * 2);
          ctx.arc(p.x + 18, potY - 40, 11, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- CALCUL DE LA TRAJECTOIRE ET ACTIONS DU ROBOT (0s à 15s) ---
      // 0s à 1.5s : Robot s'approche du Pot 1 (Menthe à x=280)
      // 1.5s à 5.0s : Arrêt Pot 1 (Scan NFC, photo, mesures)
      // 5.0s à 6.5s : Déplacement vers Pot 2 (Basilic à x=640)
      // 6.5s à 10.0s : Arrêt Pot 2 (Scan NFC, photo, mesures stress)
      // 10.0s à 11.5s : Déplacement vers Pot 3 (Tomate à x=1000)
      // 11.5s à 15.0s : Arrêt Pot 3 (Scan NFC, photo, mesures)

      let robotX = 80;
      let activePot: PatrolPlant | null = null;
      let phase: "moving" | "scanning_nfc" | "camera_photo" | "hud_display" = "moving";

      if (t < 1.5) {
        robotX = 80 + (280 - 110 - 80) * (t / 1.5);
        phase = "moving";
      } else if (t < 5.0) {
        robotX = 170;
        activePot = PATROL_PLANTS[0];
        phase = t < 2.5 ? "scanning_nfc" : t < 3.8 ? "camera_photo" : "hud_display";
      } else if (t < 6.5) {
        robotX = 170 + (640 - 110 - 170) * ((t - 5.0) / 1.5);
        phase = "moving";
      } else if (t < 10.0) {
        robotX = 530;
        activePot = PATROL_PLANTS[1];
        phase = t < 7.5 ? "scanning_nfc" : t < 8.8 ? "camera_photo" : "hud_display";
      } else if (t < 11.5) {
        robotX = 530 + (1000 - 110 - 530) * ((t - 10.0) / 1.5);
        phase = "moving";
      } else {
        robotX = 890;
        activePot = PATROL_PLANTS[2];
        phase = t < 12.5 ? "scanning_nfc" : t < 13.8 ? "camera_photo" : "hud_display";
      }

      const robotY = groundY + 10;

      // --- DESSIN DU ROBOT AGRICOLE "SMART JARRA SCOUT" ---
      ctx.save();
      ctx.translate(robotX, robotY);

      // Ombre du robot
      ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
      ctx.beginPath();
      ctx.ellipse(35, 30, 48, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deux roues tout-terrain vertes et noires crantées
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-4, 0, 18, 38, [6]);
      ctx.roundRect(58, 0, 18, 38, [6]);
      ctx.fill();
      // Jantes vert vif
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(5, 19, 5, 0, Math.PI * 2);
      ctx.arc(67, 19, 5, 0, Math.PI * 2);
      ctx.fill();

      // Châssis principal du robot (blanc laqué et liseré vert)
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, -42, 60, 50, [12]);
      ctx.fill();
      ctx.stroke();

      // Liseré vert technologie
      ctx.fillStyle = "#10b981";
      ctx.fillRect(6, -20, 60, 8);

      // Écran digital du robot
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.roundRect(14, -36, 44, 18, [4]);
      ctx.fill();
      // Yeux expressifs bleus
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(26, -27, 3.5, 0, Math.PI * 2);
      ctx.arc(46, -27, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Tourelle Caméra IA avec axe orientable
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(36, -50, 10, 0, Math.PI * 2);
      ctx.fill();
      // Lentille de caméra optique
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(phase === "camera_photo" ? 42 : 36, -50, 5, 0, Math.PI * 2);
      ctx.fill();

      // Antenne récepteur NFC latérale
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, -40);
      ctx.lineTo(68, -58);
      ctx.stroke();
      ctx.fillStyle = phase === "scanning_nfc" ? "#38bdf8" : "#10b981";
      ctx.beginPath();
      ctx.arc(68, -58, 4, 0, Math.PI * 2);
      ctx.fill();

      // --- EFFETS SPECIAUX SELON LA PHASE ---
      // 1. Onde de scan NFC (arcs bleus partant vers l'étiquette du pot)
      if (phase === "scanning_nfc" && activePot) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
        ctx.lineWidth = 2.5;
        for (let wave = 1; wave <= 3; wave++) {
          ctx.beginPath();
          ctx.arc(70, -30, 20 + wave * 18 * ((t * 4) % 1), -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
        }
      }

      // 2. Faisceau photo caméra IA (cône de lumière turquoise scannant la feuille)
      if (phase === "camera_photo" && activePot) {
        const coneGrad = ctx.createLinearGradient(42, -50, 120, -60);
        coneGrad.addColorStop(0, "rgba(56, 189, 248, 0.7)");
        coneGrad.addColorStop(1, "rgba(52, 211, 153, 0)");
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(42, -50);
        ctx.lineTo(130, -90);
        ctx.lineTo(130, -20);
        ctx.closePath();
        ctx.fill();

        // Flash de capture photo
        if (t % 1 < 0.2) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(42, -50, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // --- 3. ÉCRAN HUD FLOTTANT AVEC LES DONNÉES DU POT ---
      if (phase === "hud_display" && activePot) {
        ctx.save();
        const hudX = robotX - 40;
        const hudY = robotY - 210;
        const hudW = 220;
        const hudH = 140;

        // Panneau HUD semi-transparent moderne
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = activePot.status === "water_stress" ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, hudW, hudH, [16]);
        ctx.fill();
        ctx.stroke();

        // En-tête HUD
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Poppins, sans-serif";
        ctx.fillText(`${activePot.icon} ${activePot.name}`, hudX + 14, hudY + 24);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Tag : ${activePot.nfc}`, hudX + 14, hudY + 40);

        // Données capteurs
        ctx.font = "11px Inter, sans-serif";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(`🌡️ Température : ${activePot.temp}°C`, hudX + 14, hudY + 60);

        ctx.fillStyle = "#7dd3fc";
        ctx.fillText(`💨 Humidité air : ${activePot.airHum}%`, hudX + 14, hudY + 78);

        ctx.fillStyle = activePot.status === "water_stress" ? "#f87171" : "#6ee7b7";
        ctx.fillText(`💧 Humidité sol : ${activePot.soilHum}%`, hudX + 14, hudY + 96);

        // Recommandation d'irrigation
        ctx.fillStyle = activePot.status === "water_stress" ? "#fbbf24" : "#a7f3d0";
        ctx.font = "italic 10px Inter, sans-serif";
        ctx.fillText(activePot.recommendation, hudX + 14, hudY + 120);

        ctx.restore();
      }

      // Horodatage overlay 15s
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.fillRect(20, 20, 160, 36);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Poppins, monospace";
      ctx.fillText(`⏱ ${t.toFixed(1)}s / 15.0s`, 32, 43);
    };

    render(currentTime);
  }, [currentTime]);

  // Boucle de lecture 15s
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
        if (next >= 15.0) {
          setIsPlaying(false);
          return 15.0;
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
    if (currentTime >= 15) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

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
      a.download = "smart-jarra-scout-robot-patrouille-15s.webm";
      a.click();
    };

    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5 text-blue-700" />
            Animation 3D Robotique Mobile • 15 Secondes
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-poppins">
            Patrouille Autonome du Robot « Smart Jarra Scout »
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Déplacement dans le jardin, scan sans contact du tag NFC, capture photo IA, relevé des capteurs et affichage HUD des données.
          </p>
        </div>

        <button
          onClick={handleRecordVideo}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
            isRecording
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
          }`}
        >
          <Download className="w-4 h-4" />
          {isRecording ? "Enregistrement en cours..." : "Exporter la vidéo (.webm)"}
        </button>
      </div>

      {/* Écran Canvas 16:9 */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border-4 border-slate-900 group">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain"
        />

        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-emerald-400">
          ● AUTONOMOUS ROVER SCANNER
        </div>
      </div>

      {/* Contrôles de lecture */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
            <span>00:00</span>
            <span className="text-blue-700 font-black">
              {currentTime.toFixed(1)}s / 15.0s
            </span>
            <span>00:15</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.05"
            value={currentTime}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentTime(parseFloat(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              {isPlaying ? "Pause" : currentTime >= 15 ? "Recommencer" : "Lancer la patrouille (15s)"}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Étapes d&apos;inspection :</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px]">
              Pot 1 : Menthe (2s)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px]">
              Pot 2 : Basilic (7s)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px]">
              Pot 3 : Tomate (12s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

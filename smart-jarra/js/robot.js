/**
 * SMART JARRA — Robot Mobile Virtuel
 * Animation du robot se déplaçant dans le jardin et inspectant les pots
 */

const RobotEngine = {
  // ── État ──────────────────────────────────────────────
  state: {
    running:      false,
    currentPot:   -1,
    visitedPots:  [],
    step:         'idle',  // idle | moving | reading_nfc | taking_photo | measuring | analyzing | done
    stepTimeout:  null,
    plants:       [],
  },

  // ── Pots du jardin (positions en % du canvas) ─────────
  POTS: [
    { id: 0, x: 0.15, y: 0.25, label: 'Pot A' },
    { id: 1, x: 0.40, y: 0.15, label: 'Pot B' },
    { id: 2, x: 0.65, y: 0.25, label: 'Pot C' },
    { id: 3, x: 0.80, y: 0.55, label: 'Pot D' },
    { id: 4, x: 0.50, y: 0.70, label: 'Pot E' },
    { id: 5, x: 0.20, y: 0.60, label: 'Pot F' },
  ],

  // ── Robot position (% canvas) ─────────────────────────
  robot: {
    x: 0.08, y: 0.5,   // Position actuelle
    tx: 0.08, ty: 0.5, // Position cible
    angle: 0,
  },

  // ── Références UI ─────────────────────────────────────
  canvas:   null,
  ctx:      null,
  animLoop: null,
  onUpdate: null,  // Callback appelé à chaque mise à jour

  /**
   * Initialiser le robot avec un canvas
   */
  init(canvas, plants = [], onUpdate = null) {
    this.canvas   = canvas;
    this.ctx      = canvas.getContext('2d');
    this.onUpdate = onUpdate;
    this.state.plants = plants;
    this.state.running = false;
    this.state.currentPot = -1;
    this.state.visitedPots = [];
    this.state.step = 'idle';

    // Position initiale
    this.robot.x  = 0.08;
    this.robot.y  = 0.5;
    this.robot.tx = 0.08;
    this.robot.ty = 0.5;

    this._setupCanvas();
    this._startRenderLoop();
    this._render();
  },

  _setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    this.canvas.width  = rect.width  * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width  = rect.width  + 'px';
    this.canvas.style.height = rect.height + 'px';
    this._w = rect.width;
    this._h = rect.height;
  },

  /**
   * Lancer la mission du robot
   */
  start(plants = []) {
    if (this.state.running) return;
    this.state.plants      = plants;
    this.state.running     = true;
    this.state.currentPot  = -1;
    this.state.visitedPots = [];
    this._notify('robot_started', { message: '🤖 Robot lancé !' });
    this._moveToNextPot();
  },

  /**
   * Arrêter le robot
   */
  stop() {
    this.state.running = false;
    this.state.step    = 'idle';
    clearTimeout(this.state.stepTimeout);
    this._notify('robot_stopped', { message: '⏹ Robot arrêté.' });
  },

  /**
   * Déplacer vers le prochain pot
   */
  _moveToNextPot() {
    if (!this.state.running) return;

    const nextIdx = this.state.currentPot + 1;
    if (nextIdx >= this.POTS.length) {
      this._missionComplete();
      return;
    }

    this.state.currentPot = nextIdx;
    const pot = this.POTS[nextIdx];

    this.state.step   = 'moving';
    this.robot.tx     = pot.x;
    this.robot.ty     = pot.y - 0.1; // S'arrêter devant le pot

    // Calculer la direction
    const dx = this.robot.tx - this.robot.x;
    const dy = this.robot.ty - this.robot.y;
    this.robot.angle = Math.atan2(dy, dx);

    this._notify('robot_moving', {
      message: `🤖 → Déplacement vers ${pot.label}`,
      pot: pot.label,
      potIndex: nextIdx,
    });

    // Simuler le temps de déplacement
    const dist = Math.sqrt(dx * dx + dy * dy);
    const travelTime = 1500 + dist * 2000;

    this.state.stepTimeout = setTimeout(() => {
      this.robot.x = this.robot.tx;
      this.robot.y = this.robot.ty;
      this._readNFC(nextIdx);
    }, travelTime);
  },

  /**
   * Lire le NFC du pot
   */
  _readNFC(potIdx) {
    if (!this.state.running) return;
    const pot   = this.POTS[potIdx];
    const plant = this.state.plants[potIdx] || null;

    this.state.step = 'reading_nfc';
    const nfcId = plant ? plant.nfc_id : `NFC-POT-${potIdx + 1}`;

    this._notify('nfc_reading', {
      message: `📡 Lecture NFC: ${nfcId}`,
      nfcId,
      plant: plant?.name || 'Plante inconnue',
      potIndex: potIdx,
    });

    this.state.stepTimeout = setTimeout(() => {
      this._takePhoto(potIdx);
    }, 1200);
  },

  /**
   * Prendre une photo virtuelle
   */
  _takePhoto(potIdx) {
    if (!this.state.running) return;

    this.state.step = 'taking_photo';

    // Effet flash
    this._triggerFlash();

    this._notify('photo_taken', {
      message: '📸 Photo prise !',
      potIndex: potIdx,
    });

    this.state.stepTimeout = setTimeout(() => {
      this._measureSensors(potIdx);
    }, 800);
  },

  /**
   * Mesurer les capteurs
   */
  _measureSensors(potIdx) {
    if (!this.state.running) return;

    this.state.step = 'measuring';

    // Générer des valeurs réalistes
    const measurements = {
      temperature:  +(18 + Math.random() * 20).toFixed(1),
      air_humidity: +(35 + Math.random() * 50).toFixed(1),
      soil_moisture:+(15 + Math.random() * 70).toFixed(1),
      light:        +(100 + Math.random() * 900).toFixed(0),
    };

    this._notify('sensors_measured', {
      message: `🌡️ T:${measurements.temperature}°C | 💧 Sol:${measurements.soil_moisture}%`,
      measurements,
      potIndex: potIdx,
    });

    this.state.stepTimeout = setTimeout(() => {
      this._analyzePhoto(potIdx, measurements);
    }, 1000);
  },

  /**
   * Analyser la photo avec l'IA
   */
  async _analyzePhoto(potIdx, measurements) {
    if (!this.state.running) return;

    this.state.step = 'analyzing';

    this._notify('ai_analyzing', {
      message: '🧠 Analyse IA en cours...',
      potIndex: potIdx,
    });

    // Simuler l'analyse IA
    await new Promise(r => setTimeout(r, 1500));

    const plant = this.state.plants[potIdx];
    const aiResult = this._simulateAI(measurements, plant);

    // Sauvegarder en base
    if (plant) {
      DB.measurements.insert({
        plant_id:      plant.id,
        temperature:   measurements.temperature,
        air_humidity:  measurements.air_humidity,
        soil_moisture: measurements.soil_moisture,
        light:         measurements.light,
        ai_result:     aiResult.diagnosis,
        confidence:    aiResult.confidence,
        recommendation:aiResult.recommendation,
      });
    }

    // Marquer comme visité
    this.state.visitedPots.push(potIdx);

    this._notify('pot_complete', {
      message:    `✅ ${this.POTS[potIdx].label} analysé`,
      diagnosis:  aiResult.diagnosis,
      confidence: aiResult.confidence,
      recommendation: aiResult.recommendation,
      measurements,
      potIndex:   potIdx,
      plant:      plant?.name || `Plante ${potIdx + 1}`,
      aiResult,
    });

    // Passer au pot suivant
    this.state.stepTimeout = setTimeout(() => {
      this._moveToNextPot();
    }, 2000);
  },

  _simulateAI(measurements, plant) {
    // IA simple basée sur les mesures
    let diagnosis;
    const soil = measurements.soil_moisture;
    const temp = measurements.temperature;

    if (soil < 20)       diagnosis = 'water_stress';
    else if (soil < 15)  diagnosis = 'wilting';
    else if (temp > 38)  diagnosis = 'wilting';
    else if (temp > 33)  diagnosis = 'water_stress';
    else                 diagnosis = ['healthy', 'healthy', 'healthy', 'yellow_leaves'][Math.floor(Math.random() * 4)];

    const diagObj = PhotoAI.DIAGNOSTICS[diagnosis];
    return {
      diagnosis,
      confidence:     Math.round(72 + Math.random() * 23),
      recommendation: diagObj.recommendation,
      icon:           diagObj.icon,
      color:          diagObj.color,
      severity:       diagObj.severity,
    };
  },

  _missionComplete() {
    this.state.running = false;
    this.state.step    = 'done';

    // Retour à la base
    this.robot.tx = 0.08;
    this.robot.ty = 0.5;

    this._notify('mission_complete', {
      message:  `🏁 Mission terminée ! ${this.POTS.length} plantes inspectées.`,
      pots:     this.POTS.length,
      visited:  this.state.visitedPots.length,
    });

    setTimeout(() => {
      this.robot.x = this.robot.tx;
      this.robot.y = this.robot.ty;
      this.state.step = 'idle';
    }, 2000);
  },

  // ── Rendu Canvas ──────────────────────────────────────
  _startRenderLoop() {
    if (this.animLoop) cancelAnimationFrame(this.animLoop);
    const loop = () => {
      this._render();
      this.animLoop = requestAnimationFrame(loop);
    };
    this.animLoop = requestAnimationFrame(loop);
  },

  _render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W   = this._w || this.canvas.width;
    const H   = this._h || this.canvas.height;

    ctx.clearRect(0, 0, W, H);

    // ── Fond jardin ───────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#c8e6c9');
    bgGrad.addColorStop(1, '#a5d6a7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Texture herbe
    this._drawGrass(ctx, W, H);

    // ── Chemin du robot ───────────────────────────────────
    this._drawPath(ctx, W, H);

    // ── Pots ──────────────────────────────────────────────
    this.POTS.forEach((pot, i) => {
      this._drawPot(ctx, pot, i, W, H);
    });

    // ── Robot ─────────────────────────────────────────────
    this._drawRobot(ctx, W, H);

    // ── Interpolation position robot ──────────────────────
    if (this.state.running && this.state.step === 'moving') {
      const lerp = 0.03;
      this.robot.x += (this.robot.tx - this.robot.x) * lerp;
      this.robot.y += (this.robot.ty - this.robot.y) * lerp;
    }
  },

  _drawGrass(ctx, W, H) {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * W;
      ctx.fillRect(x, 0, 1, H);
    }
    for (let i = 0; i < 15; i++) {
      const y = (i / 15) * H;
      ctx.fillRect(0, y, W, 1);
    }
  },

  _drawPath(ctx, W, H) {
    if (this.POTS.length < 2) return;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    // Chemin de départ
    ctx.moveTo(0.08 * W, 0.5 * H);
    this.POTS.forEach(pot => ctx.lineTo(pot.x * W, (pot.y - 0.1) * H));
    ctx.stroke();
    ctx.setLineDash([]);
  },

  _drawPot(ctx, pot, idx, W, H) {
    const px     = pot.x * W;
    const py     = pot.y * H;
    const isActive  = idx === this.state.currentPot;
    const isVisited = this.state.visitedPots.includes(idx);

    // Ombre
    ctx.beginPath();
    ctx.ellipse(px, py + 22, 22, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();

    // Corps de la jarre (pot tunisien)
    ctx.beginPath();
    ctx.ellipse(px, py - 5, 18, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#ff7043' : (isVisited ? '#a5d6a7' : '#d7a87a');
    ctx.fill();

    // Corps cylindrique
    ctx.beginPath();
    ctx.rect(px - 15, py - 5, 30, 20);
    ctx.fillStyle = isActive ? '#d84315' : (isVisited ? '#66bb6a' : '#c09a6a');
    ctx.fill();

    // Bas arrondi
    ctx.beginPath();
    ctx.ellipse(px, py + 15, 15, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#bf360c' : (isVisited ? '#4caf50' : '#a0784a');
    ctx.fill();

    // Plante sur le pot
    const plant = this.state.plants[idx];
    const emoji = plant ? this._getPlantEmoji(plant.type) : '🌱';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, px, py - 10);

    // Halo si actif
    if (isActive) {
      ctx.beginPath();
      ctx.arc(px, py, 30, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(216, 67, 21, ${0.3 + Math.sin(Date.now() / 300) * 0.3})`;
      ctx.lineWidth   = 3;
      ctx.stroke();
    }

    // Checkmark si visité
    if (isVisited && !isActive) {
      ctx.font = '14px serif';
      ctx.fillText('✅', px + 15, py - 15);
    }

    // Label (numéro)
    ctx.fillStyle = '#1a2e1a';
    ctx.font = 'bold 10px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pot.label, px, py + 35);
  },

  _drawRobot(ctx, W, H) {
    const rx = this.robot.x * W;
    const ry = this.robot.y * H;
    const t  = Date.now() / 500;

    // Ombre
    ctx.beginPath();
    ctx.ellipse(rx, ry + 22, 18, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();

    // Corps du robot
    const bobY = this.state.running ? Math.sin(t) * 2 : 0;
    ctx.save();
    ctx.translate(rx, ry + bobY);

    // Corps principal
    ctx.beginPath();
    ctx.roundRect(-18, -30, 36, 40, 8);
    ctx.fillStyle = '#1565c0';
    ctx.fill();
    ctx.strokeStyle = '#0d47a1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Yeux LED
    const eyeCol = this.state.step === 'analyzing' ? '#69f0ae'
                 : this.state.step === 'reading_nfc' ? '#40c4ff'
                 : this.state.step === 'taking_photo' ? '#fff176'
                 : '#ffffff';

    ctx.beginPath();
    ctx.arc(-7, -15, 5, 0, Math.PI * 2);
    ctx.fillStyle = eyeCol;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(7, -15, 5, 0, Math.PI * 2);
    ctx.fillStyle = eyeCol;
    ctx.fill();

    // Nez (capteur)
    ctx.beginPath();
    ctx.rect(-3, -6, 6, 4);
    ctx.fillStyle = '#42a5f5';
    ctx.fill();

    // Antenne NFC
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -45);
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth   = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -47, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#1565c0';
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    if (this.state.step === 'reading_nfc') {
      // Anneaux NFC
      for (let ring = 1; ring <= 3; ring++) {
        const radius = 4 + ring * 6 * ((Date.now() / 400) % 1);
        ctx.beginPath();
        ctx.arc(0, -47, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(64,196,255,${1 - ((Date.now() / 400) % 1)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Roues
    ctx.beginPath();
    ctx.rect(-22, 5, 10, 8);
    ctx.fillStyle = '#0d47a1';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(12, 5, 10, 8);
    ctx.fillStyle = '#0d47a1';
    ctx.fill();

    // Caméra (si en train de prendre photo)
    if (this.state.step === 'taking_photo') {
      ctx.beginPath();
      ctx.arc(14, -20, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff176';
      ctx.fill();
      ctx.strokeStyle = '#f9a825';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();

    // Label robot
    ctx.fillStyle = '#1a2e1a';
    ctx.font = 'bold 10px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤖 Smart Bot', rx, ry + 32 + bobY);

    // Statut au-dessus
    if (this.state.running) {
      const statusText = {
        moving:        '→ Déplacement...',
        reading_nfc:   '📡 Lecture NFC...',
        taking_photo:  '📸 Photo...',
        measuring:     '🌡️ Mesure...',
        analyzing:     '🧠 Analyse IA...',
        done:          '✅ Mission terminée',
      }[this.state.step] || '';

      if (statusText) {
        ctx.fillStyle   = 'rgba(21,101,192,0.9)';
        ctx.beginPath();
        const tw = ctx.measureText(statusText).width + 16;
        ctx.roundRect(rx - tw/2, ry - 72, tw, 20, 10);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '10px Poppins, sans-serif';
        ctx.fillText(statusText, rx, ry - 58);
      }
    }
  },

  _notify(event, data) {
    if (this.onUpdate) {
      this.onUpdate(event, data);
    }
  },

  _triggerFlash() {
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  },

  _getPlantEmoji(type) {
    const map = {
      tomate: '🍅', menthe: '🌿', basilic: '🌱',
      persil: '🌾', romarin: '🫙', laitue: '🥬', fraise: '🍓',
    };
    return map[type] || '🌸';
  },

  destroy() {
    if (this.animLoop) cancelAnimationFrame(this.animLoop);
    clearTimeout(this.state.stepTimeout);
  },
};

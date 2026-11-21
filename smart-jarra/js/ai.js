/**
 * SMART JARRA — IA de besoin en eau + Analyse photo
 * 
 * Deux modules :
 * 1. aiWaterNeed()  — calcule le besoin en eau et recommande la méthode d'irrigation
 * 2. aiPhotoAnalysis() — simule TensorFlow.js pour l'analyse de feuilles
 */

// ══════════════════════════════════════════════════════════════
//   MODULE 1 : IA BESOIN EN EAU
// ══════════════════════════════════════════════════════════════

const WaterAI = {
  // Profils des types de plantes
  PLANT_PROFILES: {
    tomate: {
      label: 'Tomate 🍅',
      emoji: '🍅',
      baseScore: 75,         // Score de base (élevé = besoin élevé en eau)
      season: 'printemps',
      hydroCompatible: true,
      roofCompatible: false,
      description: 'Grande consommatrice d\'eau, préfère un sol constamment humide.',
    },
    menthe: {
      label: 'Menthe 🌿',
      emoji: '🌿',
      baseScore: 55,
      season: 'automne',
      hydroCompatible: true,
      roofCompatible: false,
      description: 'Besoin en eau modéré, aime l\'humidité mais pas l\'excès.',
    },
    basilic: {
      label: 'Basilic 🌱',
      emoji: '🌱',
      baseScore: 72,
      season: 'printemps',
      hydroCompatible: true,
      roofCompatible: false,
      description: 'Plante aromatique à besoin élevé en eau et chaleur.',
    },
    persil: {
      label: 'Persil 🌿',
      emoji: '🌾',
      baseScore: 35,
      season: 'automne',
      hydroCompatible: false,
      roofCompatible: true,
      description: 'Résistant à la sécheresse, tolère un sol légèrement sec.',
    },
    romarin: {
      label: 'Romarin 🌿',
      emoji: '🫙',
      baseScore: 20,
      season: 'automne',
      hydroCompatible: false,
      roofCompatible: true,
      description: 'Plante méditerranéenne, très résistante à la sécheresse.',
    },
    laitue: {
      label: 'Laitue 🥬',
      emoji: '🥬',
      baseScore: 50,
      season: 'automne',
      hydroCompatible: true,
      roofCompatible: false,
      description: 'Besoin en eau régulier, sensible aux excès de chaleur.',
    },
    fraise: {
      label: 'Fraise 🍓',
      emoji: '🍓',
      baseScore: 60,
      season: 'automne',
      hydroCompatible: true,
      roofCompatible: false,
      description: 'Besoin en eau modéré à élevé, préfère un sol frais.',
    },
    autre: {
      label: 'Autre plante',
      emoji: '🌸',
      baseScore: 50,
      season: 'printemps',
      hydroCompatible: false,
      roofCompatible: false,
      description: 'Type de plante non spécifié, recommandation générale.',
    },
  },

  // Méthodes d'irrigation
  METHODS: {
    hydroponie: {
      label: 'Hydroponie 💧',
      icon: '💧',
      color: '#1565c0',
      description: 'Culture hors-sol avec eau enrichie en nutriments. Économie d\'eau jusqu\'à 90%.',
      condition: 'Besoin en eau élevé (score ≥ 70)',
    },
    jarre: {
      label: 'Jarre enterrée 🏺',
      icon: '🏺',
      color: '#d84315',
      description: 'Jarre tunisienne poreuse enterrée près des racines. Irrigation lente et naturelle.',
      condition: 'Besoin en eau normal (40 ≤ score < 70)',
    },
    toit: {
      label: 'Toit végétalisé 🏠',
      icon: '🏠',
      color: '#2e7d32',
      description: 'Plante sur toit avec récupération d\'eau de pluie. Minimum d\'arrosage.',
      condition: 'Besoin en eau faible (score < 40)',
    },
  },

  /**
   * Calcule le besoin en eau et recommande une méthode d'irrigation
   * 
   * @param {Object} params
   * @param {string} params.type          - Type de plante (tomate, menthe, etc.)
   * @param {number} params.temperature   - Température en °C
   * @param {number} params.airHumidity   - Humidité de l'air en %
   * @param {number} params.soilMoisture  - Humidité du sol en %
   * @param {string} params.season        - Saison (printemps, été, automne, hiver)
   * @returns {Object} Résultat IA
   */
  calculate(params) {
    const {
      type         = 'autre',
      temperature  = 25,
      airHumidity  = 50,
      soilMoisture = 50,
      season       = 'printemps',
    } = params;

    const profile = this.PLANT_PROFILES[type] || this.PLANT_PROFILES.autre;
    let score = profile.baseScore;

    // ── Ajustements temperature ───────────────────────────
    // Plus il fait chaud → besoin plus élevé
    if (temperature > 35) score += 20;
    else if (temperature > 30) score += 12;
    else if (temperature > 25) score += 6;
    else if (temperature < 15) score -= 10;
    else if (temperature < 10) score -= 15;

    // ── Ajustements humidité de l'air ─────────────────────
    // Plus l'air est sec → besoin plus élevé
    if (airHumidity < 30) score += 15;
    else if (airHumidity < 45) score += 8;
    else if (airHumidity > 70) score -= 8;
    else if (airHumidity > 85) score -= 15;

    // ── Ajustements humidité du sol ───────────────────────
    // Sol sec → besoin élevé
    if (soilMoisture < 20) score += 20;
    else if (soilMoisture < 35) score += 10;
    else if (soilMoisture > 70) score -= 10;
    else if (soilMoisture > 85) score -= 20;

    // ── Ajustements saison ────────────────────────────────
    const seasonBonus = {
      printemps: +5,
      été:       +15,
      automne:   -5,
      hiver:     -20,
    };
    score += seasonBonus[season] || 0;

    // Clamp entre 0 et 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    // ── Détermination du niveau de besoin ─────────────────
    let waterNeed, methodKey, methodLabel;

    if (score >= 70) {
      waterNeed = 'élevé';
      // Hydroponie si compatible, sinon jarre
      methodKey   = profile.hydroCompatible ? 'hydroponie' : 'jarre';
    } else if (score >= 40) {
      waterNeed = 'normal';
      methodKey  = 'jarre';
    } else {
      waterNeed = 'faible';
      // Toit si compatible, sinon jarre
      methodKey   = profile.roofCompatible ? 'toit' : 'jarre';
    }

    const method = this.METHODS[methodKey];

    // ── Raison de la recommandation ───────────────────────
    const reasons = [];
    if (temperature > 28) reasons.push(`Température élevée (${temperature}°C)`);
    if (airHumidity < 40) reasons.push(`Air sec (${airHumidity}% humidité)`);
    if (soilMoisture < 30) reasons.push(`Sol trop sec (${soilMoisture}%)`);
    if (soilMoisture > 75) reasons.push(`Sol saturé (${soilMoisture}%)`);
    reasons.push(`${profile.description}`);

    return {
      score,
      waterNeed,
      method:       method.label,
      methodKey,
      methodIcon:   method.icon,
      methodColor:  method.color,
      methodDesc:   method.description,
      reason:       reasons.join('. '),
      season:       profile.season,
      plantEmoji:   profile.emoji,
      plantDesc:    profile.description,
    };
  },

  getSeason(type) {
    const profile = this.PLANT_PROFILES[type];
    return profile ? profile.season : 'printemps';
  },

  getAllTypes() {
    return Object.entries(this.PLANT_PROFILES).map(([key, val]) => ({
      key,
      label: val.label,
      emoji: val.emoji,
    }));
  },
};

// ══════════════════════════════════════════════════════════════
//   MODULE 2 : IA ANALYSE PHOTO (TensorFlow.js simulé)
// ══════════════════════════════════════════════════════════════

const PhotoAI = {
  // Diagnostics possibles
  DIAGNOSTICS: {
    healthy: {
      label:    'Plante saine ✅',
      icon:     '✅',
      color:    '#2e7d32',
      severity: 'good',
      recommendation: 'Plante en excellente santé. Maintenir les conditions actuelles d\'irrigation et d\'exposition solaire. Continuer l\'irrigation normale.',
    },
    water_stress: {
      label:    'Stress hydrique 💧',
      icon:     '💧',
      color:    '#1565c0',
      severity: 'warning',
      recommendation: 'Augmenter immédiatement l\'arrosage. Ouvrir la valve de la jarre. Vérifier l\'humidité du sol toutes les 6 heures.',
    },
    yellow_leaves: {
      label:    'Feuilles jaunissantes 🟡',
      icon:     '🍂',
      color:    '#f57f17',
      severity: 'warning',
      recommendation: 'Vérifier le pH du sol (idéal 6.0–7.0). Ajouter du compost ou engrais naturel. Réduire légèrement l\'arrosage.',
    },
    disease_spots: {
      label:    'Taches de maladie 🔴',
      icon:     '🦠',
      color:    '#c62828',
      severity: 'danger',
      recommendation: 'Traiter avec un fongicide naturel (bicarbonate de soude + eau). Isoler la plante. Retirer les feuilles affectées. Contacter un expert.',
    },
    wilting: {
      label:    'Flétrissement 🥀',
      icon:     '🥀',
      color:    '#6a1b9a',
      severity: 'danger',
      recommendation: 'Arrosage d\'urgence nécessaire. Placer à l\'ombre temporairement. Vérifier les racines pour tout pourrissement.',
    },
  },

  // Modèle TensorFlow.js chargé ?
  modelLoaded: false,
  model: null,

  /**
   * Analyse une image et retourne un diagnostic
   * En mode simulation (sans modèle IA réel)
   * 
   * @param {HTMLImageElement|string} imageEl - Élément image ou URL
   * @returns {Promise<Object>} Résultat du diagnostic
   */
  async analyze(imageEl) {
    // Simuler un délai de traitement IA
    await this._delay(1500 + Math.random() * 1000);

    if (this.modelLoaded && this.model) {
      return this._analyzeWithTF(imageEl);
    } else {
      return this._simulateAnalysis(imageEl);
    }
  },

  /**
   * Simulation intelligente basée sur les couleurs de l'image
   */
  async _simulateAnalysis(imageEl) {
    // Analyser les couleurs dominantes si possible
    let colorHint = null;
    try {
      colorHint = this._analyzeImageColors(imageEl);
    } catch (e) {}

    // Résultats simulés avec probabilités
    let weights;
    if (colorHint === 'yellow') {
      weights = { healthy: 5, water_stress: 15, yellow_leaves: 60, disease_spots: 15, wilting: 5 };
    } else if (colorHint === 'brown') {
      weights = { healthy: 5, water_stress: 10, yellow_leaves: 20, disease_spots: 40, wilting: 25 };
    } else if (colorHint === 'dark') {
      weights = { healthy: 10, water_stress: 20, yellow_leaves: 10, disease_spots: 30, wilting: 30 };
    } else {
      // Favoriser "healthy" pour une démo positive
      weights = { healthy: 55, water_stress: 20, yellow_leaves: 12, disease_spots: 8, wilting: 5 };
    }

    const selected = this._weightedRandom(weights);
    const diag     = this.DIAGNOSTICS[selected];
    const confidence = 72 + Math.random() * 23; // 72% – 95%

    // Probabilités pour toutes les classes
    const allProbs = this._generateAllProbs(selected, confidence);

    return {
      diagnosis:      selected,
      label:          diag.label,
      icon:           diag.icon,
      color:          diag.color,
      severity:       diag.severity,
      confidence:     Math.round(confidence),
      recommendation: diag.recommendation,
      probabilities:  allProbs,
      modelType:      'Simulation IA (PlantVillage simulé)',
    };
  },

  /**
   * Analyse réelle avec TensorFlow.js MobileNet
   */
  async _analyzeWithTF(imageEl) {
    try {
      const predictions = await this.model.classify(imageEl, 5);
      // Mapper les classes ImageNet aux diagnostics
      const mapping = this._mapImageNetToPlant(predictions);
      return mapping;
    } catch (e) {
      console.warn('Erreur TF.js, retour en simulation:', e);
      return this._simulateAnalysis(imageEl);
    }
  },

  /**
   * Charger le modèle TensorFlow.js MobileNet
   */
  async loadModel() {
    if (this.modelLoaded) return true;
    try {
      // Charger MobileNet (nécessite TensorFlow.js CDN)
      if (typeof mobilenet !== 'undefined') {
        this.model = await mobilenet.load();
        this.modelLoaded = true;
        console.log('✅ Modèle MobileNet chargé');
        return true;
      }
    } catch (e) {
      console.warn('Modèle IA non disponible:', e);
    }
    return false;
  },

  /**
   * Analyser les couleurs dominantes de l'image
   */
  _analyzeImageColors(imgEl) {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, 50, 50);
    const data = ctx.getImageData(0, 0, 50, 50).data;

    let r = 0, g = 0, b = 0;
    const pixels = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
    }
    r /= pixels; g /= pixels; b /= pixels;

    if (g > r * 1.2 && g > b * 1.2) return 'green';
    if (r > 150 && g > 120 && b < 80) return 'yellow';
    if (r > 120 && g < 80 && b < 80) return 'brown';
    if (r < 80 && g < 80 && b < 80) return 'dark';
    return 'mixed';
  },

  _weightedRandom(weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (const [key, weight] of Object.entries(weights)) {
      rand -= weight;
      if (rand <= 0) return key;
    }
    return Object.keys(weights)[0];
  },

  _generateAllProbs(winner, confidence) {
    const all = Object.keys(this.DIAGNOSTICS);
    const probs = {};
    const remaining = 100 - confidence;
    let used = 0;

    all.forEach((key, i) => {
      if (key === winner) {
        probs[key] = confidence;
      } else if (i === all.length - 1) {
        probs[key] = Math.max(0, remaining - used);
      } else {
        const share = Math.random() * (remaining - used) * 0.5;
        probs[key] = Math.round(share);
        used += probs[key];
      }
    });
    return probs;
  },

  _mapImageNetToPlant(predictions) {
    // Heuristique simple : mapper ImageNet → diagnostic
    const topPrediction = predictions[0]?.className?.toLowerCase() || '';

    let diag = 'healthy';
    if (topPrediction.includes('banana') || topPrediction.includes('yellow')) {
      diag = 'yellow_leaves';
    } else if (topPrediction.includes('mushroom') || topPrediction.includes('fungus')) {
      diag = 'disease_spots';
    }

    const d = this.DIAGNOSTICS[diag];
    return {
      diagnosis:      diag,
      label:          d.label,
      icon:           d.icon,
      color:          d.color,
      severity:       d.severity,
      confidence:     Math.round((predictions[0]?.probability || 0.85) * 100),
      recommendation: d.recommendation,
      probabilities:  {},
      modelType:      'MobileNet v2 (TensorFlow.js)',
    };
  },

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};

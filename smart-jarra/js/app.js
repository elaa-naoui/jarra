/**
 * SMART JARRA — Application principale (Router + Pages)
 * SPA avec navigation sans rechargement
 */

// ══════════════════════════════════════════════════════════════
//   ROUTER & ÉTAT GLOBAL
// ══════════════════════════════════════════════════════════════

const App = {
  currentPage: 'home',
  selectedPlant: null,

  pages: ['home', 'plantation', 'robot', 'analysis', 'plants', 'dashboard'],

  navigate(page) {
    if (!this.pages.includes(page)) return;

    // Désactiver l'ancienne page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Activer la nouvelle page
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) {
      pageEl.classList.add('active');
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo(0, 0);
    }

    // Marquer le nav
    const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');

    this.currentPage = page;

    // Rendre la page
    switch(page) {
      case 'home':       Pages.home.render(); break;
      case 'plantation': Pages.plantation.render(); break;
      case 'robot':      Pages.robot.render(); break;
      case 'analysis':   Pages.analysis.render(); break;
      case 'plants':     Pages.plants.render(); break;
      case 'dashboard':  Pages.dashboard.render(); break;
    }

    // Fermer le menu mobile
    document.getElementById('nav-links')?.classList.remove('mobile-open');

    // Observer scroll
    this._observeReveal();
  },

  _observeReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger')
      .forEach(el => observer.observe(el));
  },

  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast     = document.createElement('div');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${icons[type] || '✅'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  },

  formatDate(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  },

  formatDateShort(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  },

  getStatusBadge(status) {
    const badges = {
      healthy:      `<span class="badge badge-green">✅ Saine</span>`,
      water_stress: `<span class="badge badge-blue">💧 Stress hydrique</span>`,
      yellow_leaves:`<span class="badge badge-warning">🍂 Jaunissement</span>`,
      disease_spots:`<span class="badge badge-danger">🦠 Maladie</span>`,
      wilting:      `<span class="badge" style="background:#f3e5f5;color:#6a1b9a">🥀 Flétrissement</span>`,
    };
    return badges[status] || `<span class="badge">${status}</span>`;
  },

  getPlantEmoji(type) {
    const map = {
      tomate: '🍅', menthe: '🌿', basilic: '🌱',
      persil: '🌾', romarin: '🫙', laitue: '🥬', fraise: '🍓', autre: '🌸',
    };
    return map[type] || '🌱';
  },

  getMethodIcon(method) {
    if (!method) return '🏺';
    if (method.includes('hydro')) return '💧';
    if (method.includes('toit'))  return '🏠';
    return '🏺';
  },
};

// ══════════════════════════════════════════════════════════════
//   PAGES
// ══════════════════════════════════════════════════════════════

const Pages = {

  // ════════════════════════════════════
  //   HOME
  // ════════════════════════════════════
  home: {
    particlesInterval: null,

    render() {
      this.initParticles();
    },

    initParticles() {
      clearInterval(this.particlesInterval);
      const container = document.querySelector('.hero-particles');
      if (!container) return;
      container.innerHTML = '';

      const createParticle = () => {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        p.style.cssText = `
          left: ${Math.random() * 100}%;
          bottom: -10px;
          width: ${4 + Math.random() * 8}px;
          height: ${4 + Math.random() * 8}px;
          animation-duration: ${8 + Math.random() * 12}s;
          animation-delay: ${Math.random() * 5}s;
          opacity: ${0.2 + Math.random() * 0.5};
        `;
        container.appendChild(p);
        setTimeout(() => p.remove(), 20000);
      };

      for (let i = 0; i < 15; i++) createParticle();
      this.particlesInterval = setInterval(createParticle, 1200);
    },
  },

  // ════════════════════════════════════
  //   PLANTATION
  // ════════════════════════════════════
  plantation: {
    selectedType: 'tomate',
    lastResult:   null,

    render() {
      this.renderTypeGrid();
      this.attachEvents();
    },

    renderTypeGrid() {
      const grid = document.getElementById('plant-type-grid');
      if (!grid) return;

      grid.innerHTML = WaterAI.getAllTypes().map(t => `
        <button class="plant-type-btn ${t.key === this.selectedType ? 'selected' : ''}"
                data-type="${t.key}" id="type-btn-${t.key}">
          <span style="font-size:1.3rem">${t.emoji}</span>
          <span>${t.label}</span>
        </button>
      `).join('');

      // Events
      grid.querySelectorAll('.plant-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.plant-type-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.selectedType = btn.dataset.type;
          // Auto-remplir la saison
          const seasonEl = document.getElementById('plant-season');
          if (seasonEl) seasonEl.value = WaterAI.getSeason(this.selectedType);
          // Recalculer si déjà un résultat
          if (this.lastResult) this.calculate();
        });
      });
    },

    attachEvents() {
      const form = document.getElementById('plantation-form');
      if (!form) return;

      // Saison auto
      const seasonEl = document.getElementById('plant-season');
      if (seasonEl) seasonEl.value = WaterAI.getSeason(this.selectedType);

      form.addEventListener('submit', e => {
        e.preventDefault();
        this.calculate();
      });
    },

    calculate() {
      const name        = document.getElementById('plant-name')?.value?.trim() || 'Ma plante';
      const temperature = parseFloat(document.getElementById('plant-temp')?.value)  || 25;
      const airHumidity = parseFloat(document.getElementById('plant-humidity')?.value) || 50;
      const soilMoisture= parseFloat(document.getElementById('plant-soil')?.value) || 50;
      const season      = document.getElementById('plant-season')?.value || 'printemps';

      const result = WaterAI.calculate({
        type:        this.selectedType,
        temperature,
        airHumidity,
        soilMoisture,
        season,
      });

      this.lastResult = { name, ...result };
      this.renderResult(result, name);
    },

    renderResult(result, name) {
      const el = document.getElementById('ai-result-panel');
      if (!el) return;

      const scoreColor = result.score >= 70 ? '#1565c0' : result.score >= 40 ? '#d84315' : '#2e7d32';
      const gradient   = `linear-gradient(135deg, ${scoreColor}, ${scoreColor}99)`;

      el.innerHTML = `
        <div class="ai-score-card animate-up">
          <div class="ai-score-circle" style="background:${gradient};width:140px;height:140px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:var(--space-lg) auto;box-shadow:0 8px 30px ${scoreColor}50;">
            <div class="ai-score-value">${result.score}</div>
            <div class="ai-score-label">Score IA</div>
          </div>
          <h3 style="margin-bottom:0.5rem">${result.plantEmoji} ${name}</h3>
          <div class="flex items-center justify-center gap-md" style="margin-bottom:var(--space-lg)">
            <span class="badge badge-${result.waterNeed === 'élevé' ? 'blue' : result.waterNeed === 'normal' ? 'terra' : 'green'}">
              Besoin ${result.waterNeed}
            </span>
            <span class="badge badge-green">Saison: ${result.season}</span>
          </div>
        </div>

        <div class="method-card animate-up" style="border-color:${result.methodColor}20">
          <div class="method-icon">${result.methodIcon}</div>
          <div>
            <div class="overline" style="color:${result.methodColor}">Méthode recommandée</div>
            <h3 style="color:${result.methodColor};margin-bottom:0.4rem">${result.method}</h3>
            <p style="font-size:0.85rem">${result.methodDesc}</p>
          </div>
        </div>

        <div class="card animate-up" style="background:var(--bg)">
          <div class="overline">Raison de la recommandation</div>
          <p style="font-size:0.875rem">${result.reason}</p>
        </div>

        <button class="btn btn-primary btn-full" id="save-plant-btn">
          🌱 Ajouter la plante
        </button>
      `;

      // Bouton sauvegarder
      document.getElementById('save-plant-btn')?.addEventListener('click', () => {
        this.savePlant(name, result);
      });
    },

    savePlant(name, result) {
      DB.plants.insert({
        name,
        type:              this.selectedType,
        season:            result.season,
        water_need:        result.waterNeed,
        irrigation_method: result.method,
        status:            'healthy',
        ai_score:          result.score,
      });

      App.toast(`🌱 "${name}" ajoutée avec succès !`, 'success');

      // Reset form
      document.getElementById('plantation-form')?.reset();
      document.getElementById('plant-season').value = WaterAI.getSeason(this.selectedType);
      document.getElementById('ai-result-panel').innerHTML = this._emptyState();
      this.lastResult = null;
    },

    _emptyState() {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">🌱</div>
          <h3>Choisissez une plante</h3>
          <p>Remplissez le formulaire pour obtenir une recommandation d'irrigation personnalisée.</p>
        </div>
      `;
    },
  },

  // ════════════════════════════════════
  //   ROBOT
  // ════════════════════════════════════
  robot: {
    initialized: false,
    logs: [],

    render() {
      const canvas = document.getElementById('garden-canvas');
      if (!canvas) return;

      if (!this.initialized) {
        this.initialized = true;
        this.logs = [];
      }

      // Mettre à jour liste des pots dans la sidebar
      this.renderPotList();

      const plants = DB.plants.getAll().slice(0, 6);
      RobotEngine.init(canvas, plants, (event, data) => this.onRobotUpdate(event, data));
    },

    renderPotList() {
      const list = document.getElementById('pot-list');
      if (!list) return;

      const plants = DB.plants.getAll().slice(0, 6);
      list.innerHTML = RobotEngine.POTS.map((pot, i) => {
        const plant = plants[i];
        return `
          <div class="pot-item" id="pot-item-${i}">
            <span class="pot-emoji">${plant ? App.getPlantEmoji(plant.type) : '🪴'}</span>
            <div>
              <div style="font-size:0.85rem;font-weight:600">${pot.label}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${plant?.name || 'Pas de plante'}</div>
            </div>
          </div>
        `;
      }).join('');
    },

    onRobotUpdate(event, data) {
      // Ajouter au log
      const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.logs.unshift({ time, message: data.message });
      if (this.logs.length > 20) this.logs.pop();
      this.renderLog();

      // Mettre à jour l'état
      const statusEl = document.getElementById('robot-status-text');
      if (statusEl) statusEl.textContent = data.message;

      // Mettre à jour capteurs si disponible
      if (event === 'sensors_measured' && data.measurements) {
        this.updateSensors(data.measurements);
      }

      // Mettre à jour pot actif
      if (event === 'pot_complete') {
        this.renderPotResult(data);
      }

      // Mettre à jour pot dans la liste
      if (data.potIndex !== undefined) {
        document.querySelectorAll('.pot-item').forEach((el, i) => {
          el.classList.toggle('active', i === data.potIndex);
          if (i < data.potIndex) el.classList.add('visited');
        });
      }

      // NFC animation
      const nfcEl = document.getElementById('nfc-status');
      if (nfcEl) {
        nfcEl.textContent = event === 'nfc_reading' ? `📡 ${data.nfcId}` : '📡 En attente...';
        nfcEl.style.display = event === 'nfc_reading' ? 'flex' : 'none';
      }

      // Boutons
      if (event === 'mission_complete' || event === 'robot_stopped') {
        document.getElementById('btn-start-robot')?.removeAttribute('disabled');
        document.getElementById('btn-stop-robot')?.setAttribute('disabled', 'true');
      }
    },

    updateSensors(m) {
      document.getElementById('sensor-temp')?.innerText !== undefined &&
        (document.getElementById('sensor-temp').textContent = `${m.temperature}°C`);
      document.getElementById('sensor-humidity')?.innerText !== undefined &&
        (document.getElementById('sensor-humidity').textContent = `${m.air_humidity}%`);
      document.getElementById('sensor-soil')?.innerText !== undefined &&
        (document.getElementById('sensor-soil').textContent = `${m.soil_moisture}%`);
      document.getElementById('sensor-light')?.innerText !== undefined &&
        (document.getElementById('sensor-light').textContent = `${m.light} lux`);
    },

    renderPotResult(data) {
      const el = document.getElementById('current-diagnosis');
      if (!el) return;

      const diag = PhotoAI.DIAGNOSTICS[data.diagnosis] || {};
      el.innerHTML = `
        <div style="font-size:1.5rem;margin-bottom:0.5rem">${diag.icon || '🔍'}</div>
        <div style="font-weight:700;color:${diag.color};margin-bottom:0.4rem">${diag.label || data.diagnosis}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">Confiance: ${data.confidence}%</div>
        <div class="confidence-track" style="margin:0.5rem 0">
          <div class="confidence-fill" style="width:${data.confidence}%"></div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-soft)">${data.recommendation}</div>
      `;
    },

    renderLog() {
      const logEl = document.getElementById('robot-log');
      if (!logEl) return;
      logEl.innerHTML = this.logs.map(l => `
        <div class="log-entry">
          <span class="log-time">${l.time}</span>
          <span>${l.message}</span>
        </div>
      `).join('');
    },
  },

  // ════════════════════════════════════
  //   ANALYSIS
  // ════════════════════════════════════
  analysis: {
    uploadedImage: null,
    currentResult: null,

    render() {
      this.attachEvents();
      this.renderPlantSelector();
    },

    renderPlantSelector() {
      const sel = document.getElementById('analysis-plant-select');
      if (!sel) return;

      const plants = DB.plants.getAll();
      sel.innerHTML = `
        <option value="">-- Choisir une plante (optionnel) --</option>
        ${plants.map(p => `<option value="${p.id}">${App.getPlantEmoji(p.type)} ${p.name}</option>`).join('')}
      `;
    },

    attachEvents() {
      const zone      = document.getElementById('upload-zone');
      const fileInput = document.getElementById('photo-input');
      const analyzeBtn= document.getElementById('analyze-btn');
      const aiRealBtn = document.getElementById('btn-ai-real');

      if (!zone || !fileInput) return;

      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) this.loadImage(file);
      });

      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) this.loadImage(file);
      });

      analyzeBtn?.addEventListener('click', () => this.analyze());

      aiRealBtn?.addEventListener('click', async () => {
        aiRealBtn.textContent = '⏳ Chargement du modèle...';
        aiRealBtn.disabled = true;
        const loaded = await PhotoAI.loadModel();
        if (loaded) {
          aiRealBtn.textContent = '✅ Modèle IA activé';
          App.toast('Modèle MobileNet chargé !', 'success');
        } else {
          aiRealBtn.textContent = '❌ Modèle non disponible (simulation)';
          App.toast('TensorFlow.js non chargé. Mode simulation activé.', 'warning');
        }
      });
    },

    loadImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.uploadedImage = e.target.result;
        const preview = document.getElementById('photo-preview');
        if (preview) {
          preview.src = e.target.result;
          preview.parentElement.classList.remove('hidden');
        }
        document.getElementById('upload-placeholder')?.classList.add('hidden');
        document.getElementById('analyze-btn')?.removeAttribute('disabled');
        document.getElementById('analyze-btn').textContent = '🔍 Analyser la photo';
      };
      reader.readAsDataURL(file);
    },

    async analyze() {
      if (!this.uploadedImage) {
        App.toast('Veuillez choisir une image d\'abord.', 'warning');
        return;
      }

      const btn = document.getElementById('analyze-btn');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto"></div> Analyse IA...';

      const resultEl = document.getElementById('diagnosis-result');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="flex items-center justify-center" style="padding:var(--space-3xl)">
            <div class="spinner"></div>
          </div>
          <p class="text-center text-sm" style="color:var(--text-muted);margin-top:var(--space-md)">
            🧠 Analyse en cours... (${PhotoAI.modelLoaded ? 'MobileNet' : 'Simulation IA'})
          </p>
        `;
      }

      // Créer un élément image pour l'analyse
      const imgEl = document.getElementById('photo-preview');
      const result = await PhotoAI.analyze(imgEl);
      this.currentResult = result;

      // Sauvegarder si une plante est sélectionnée
      const plantId = document.getElementById('analysis-plant-select')?.value;
      if (plantId) {
        DB.measurements.insert({
          plant_id:       plantId,
          temperature:    25,
          air_humidity:   50,
          soil_moisture:  50,
          light:          500,
          ai_result:      result.diagnosis,
          confidence:     result.confidence,
          recommendation: result.recommendation,
        });
      }

      this.renderResult(result);

      btn.disabled = false;
      btn.textContent = '🔍 Analyser à nouveau';
    },

    renderResult(result) {
      const el = document.getElementById('diagnosis-result');
      if (!el) return;

      const all = Object.entries(result.probabilities || {});
      const probBars = all.length ? `
        <div class="divider"></div>
        <div class="overline">Probabilités par classe</div>
        ${all.map(([k, v]) => `
          <div style="margin-bottom:0.5rem">
            <div class="confidence-label">
              <span>${PhotoAI.DIAGNOSTICS[k]?.label || k}</span>
              <span>${Math.round(v)}%</span>
            </div>
            <div class="confidence-track">
              <div class="confidence-fill" style="width:${v}%;background:${PhotoAI.DIAGNOSTICS[k]?.color || '#ccc'}"></div>
            </div>
          </div>
        `).join('')}
      ` : '';

      el.innerHTML = `
        <div class="diagnosis-icon" style="color:${result.color}">${result.icon}</div>
        <h3 style="color:${result.color};text-align:center;margin-bottom:var(--space-sm)">${result.label}</h3>

        <div class="confidence-bar-wrap">
          <div class="confidence-label">
            <span>Confiance IA</span>
            <span style="color:${result.color}">${result.confidence}%</span>
          </div>
          <div class="confidence-track">
            <div class="confidence-fill" style="width:${result.confidence}%;background:${result.color}"></div>
          </div>
        </div>

        <div class="alert ${result.severity === 'good' ? 'alert-success' : result.severity === 'danger' ? 'alert-error' : 'alert-warning'}">
          <span>💡</span>
          <span>${result.recommendation}</span>
        </div>

        <div class="text-xs" style="color:var(--text-muted);margin-top:var(--space-md);text-align:center">
          Modèle: ${result.modelType}
        </div>

        ${probBars}
      `;
    },
  },

  // ════════════════════════════════════
  //   MY PLANTS
  // ════════════════════════════════════
  plants: {
    selectedPlant: null,
    viewMode: 'grid', // grid | detail

    render() {
      this.viewMode = 'grid';
      this.renderGrid();
    },

    renderGrid() {
      const plants  = DB.plants.getAll();
      const content = document.getElementById('plants-content');
      if (!content) return;

      if (!plants.length) {
        content.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🪴</div>
            <h3>Aucune plante enregistrée</h3>
            <p>Ajoutez votre première plante depuis la page Plantation immédiate.</p>
            <button class="btn btn-primary" onclick="App.navigate('plantation')">
              🌱 Ajouter une plante
            </button>
          </div>
        `;
        return;
      }

      content.innerHTML = `
        <div class="plants-grid">
          ${plants.map(p => this.renderPlantCard(p)).join('')}
        </div>
      `;

      // Events
      content.querySelectorAll('.plant-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.plantId;
          const plant = DB.plants.getById(id);
          if (plant) this.renderDetail(plant);
        });
      });
    },

    renderPlantCard(plant) {
      const bgColors = {
        healthy:      'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        water_stress: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        yellow_leaves:'linear-gradient(135deg, #fff8e1, #fff9c4)',
        disease_spots:'linear-gradient(135deg, #fce4e4, #ffcdd2)',
        wilting:      'linear-gradient(135deg, #f3e5f5, #e1bee7)',
      };

      return `
        <div class="plant-card hover-lift" data-plant-id="${plant.id}">
          <div class="plant-card-image" style="background:${bgColors[plant.status] || bgColors.healthy}">
            ${App.getPlantEmoji(plant.type)}
            <div style="position:absolute;top:10px;right:10px">
              ${App.getStatusBadge(plant.status)}
            </div>
          </div>
          <div class="plant-card-body">
            <h4>${plant.name}</h4>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.4rem">
              <span class="plant-method-tag">${App.getMethodIcon(plant.irrigation_method)} ${plant.irrigation_method || 'Jarre'}</span>
              <span class="chip" style="font-size:0.7rem">${plant.season || 'printemps'}</span>
            </div>
            <div class="plant-status-bar" style="margin-top:0.75rem">
              <span>Score IA:</span>
              <div class="progress-bar" style="flex:1">
                <div class="progress-fill" style="width:${plant.ai_score || 50}%"></div>
              </div>
              <span style="font-weight:700">${plant.ai_score || 50}</span>
            </div>
          </div>
        </div>
      `;
    },

    renderDetail(plant) {
      this.selectedPlant = plant;
      const content      = document.getElementById('plants-content');
      const measurements = DB.measurements.getByPlant(plant.id).slice(0, 7);
      const jar          = DB.jars.getByPlant(plant.id);

      content.innerHTML = `
        <button class="btn btn-ghost btn-sm" id="back-to-grid" style="margin-bottom:var(--space-lg)">
          ← Retour à la liste
        </button>

        <div class="plant-detail-layout">
          <!-- Colonne gauche -->
          <div class="plant-detail-left">
            <div class="plant-detail-visual">
              <span class="plant-detail-emoji">${App.getPlantEmoji(plant.type)}</span>
              ${App.getStatusBadge(plant.status)}
              <div style="margin-top:var(--space-lg)">
                ${jar ? `
                  <div style="text-align:center">
                    <div class="overline">Niveau jarre</div>
                    <div style="font-size:2rem;font-weight:800;color:var(--blue)">${Math.round(jar.level)}%</div>
                    <div class="progress-bar" style="margin-top:0.4rem">
                      <div class="progress-fill" style="width:${jar.level}%;background:var(--grad-blue)"></div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Modifier -->
            <div class="card" style="margin-top:var(--space-lg)">
              <h4 style="margin-bottom:var(--space-md)">✏️ Modifier</h4>
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input class="form-input" id="edit-name" value="${plant.name}">
              </div>
              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-select" id="edit-type">
                  ${WaterAI.getAllTypes().map(t =>
                    `<option value="${t.key}" ${t.key === plant.type ? 'selected' : ''}>${t.label}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Méthode d'irrigation</label>
                <select class="form-select" id="edit-method">
                  <option value="jarre enterrée"   ${plant.irrigation_method?.includes('jarre') ? 'selected' : ''}>🏺 Jarre enterrée</option>
                  <option value="hydroponie"        ${plant.irrigation_method?.includes('hydro') ? 'selected' : ''}>💧 Hydroponie</option>
                  <option value="plante sur toit"   ${plant.irrigation_method?.includes('toit')  ? 'selected' : ''}>🏠 Toit végétalisé</option>
                </select>
              </div>
              <div style="display:flex;gap:var(--space-sm)">
                <button class="btn btn-primary" id="save-plant-edits" style="flex:1">💾 Sauvegarder</button>
                <button class="btn btn-danger btn-sm" id="delete-plant-btn">🗑️</button>
              </div>
            </div>
          </div>

          <!-- Colonne droite -->
          <div>
            <div class="card">
              <div class="chart-card-header">
                <div class="chart-card-title">📊 Historique des mesures</div>
                <span class="text-xs" style="color:var(--text-muted)">${measurements.length} mesures</span>
              </div>
              ${measurements.length > 0 ? `
                <canvas id="plant-chart" style="width:100%;height:200px"></canvas>
              ` : '<div class="empty-state" style="padding:var(--space-xl)"><div class="empty-state-icon">📊</div><p>Aucune mesure</p></div>'}
            </div>

            <div class="card" style="margin-top:var(--space-lg)">
              <h4 style="margin-bottom:var(--space-md)">🕒 Dernières mesures</h4>
              ${measurements.length > 0 ? `
                <div style="overflow-x:auto">
                  <table class="measurement-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>🌡️ Temp</th>
                        <th>💧 Sol</th>
                        <th>🏥 État</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${measurements.map(m => `
                        <tr>
                          <td>${App.formatDateShort(m.created_at)}</td>
                          <td>${m.temperature?.toFixed(1)}°C</td>
                          <td>${m.soil_moisture?.toFixed(0)}%</td>
                          <td>${App.getStatusBadge(m.ai_result)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : '<p class="text-sm" style="color:var(--text-muted)">Aucune mesure enregistrée.</p>'}
            </div>
          </div>
        </div>
      `;

      // Dessiner le graphique
      if (measurements.length > 0) {
        requestAnimationFrame(() => {
          const canvas = document.getElementById('plant-chart');
          if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width  = canvas.offsetWidth * dpr;
            canvas.height = 200 * dpr;
            canvas.getContext('2d').scale(dpr, dpr);
            canvas.style.width  = canvas.offsetWidth + 'px';
            canvas.style.height = '200px';

            Charts.drawLine(canvas, {
              labels:   measurements.map(m => App.formatDateShort(m.created_at)).reverse(),
              datasets: [
                { label: 'Température (°C)', data: [...measurements].reverse().map(m => m.temperature || 0),    color: '#ef5350' },
                { label: 'Humidité sol (%)', data:  [...measurements].reverse().map(m => m.soil_moisture || 0), color: '#42a5f5' },
              ],
            });
          }
        });
      }

      // Events
      document.getElementById('back-to-grid')?.addEventListener('click', () => this.renderGrid());

      document.getElementById('save-plant-edits')?.addEventListener('click', () => {
        const name   = document.getElementById('edit-name')?.value;
        const type   = document.getElementById('edit-type')?.value;
        const method = document.getElementById('edit-method')?.value;
        DB.plants.update(plant.id, { name, type, irrigation_method: method });
        App.toast('✅ Plante mise à jour !', 'success');
        this.renderGrid();
      });

      document.getElementById('delete-plant-btn')?.addEventListener('click', () => {
        if (confirm(`Supprimer "${plant.name}" ?`)) {
          DB.plants.delete(plant.id);
          App.toast('🗑️ Plante supprimée.', 'info');
          this.renderGrid();
        }
      });
    },
  },

  // ════════════════════════════════════
  //   DASHBOARD
  // ════════════════════════════════════
  dashboard: {
    refreshInterval: null,

    render() {
      this.refreshData();
      clearInterval(this.refreshInterval);
      this.refreshInterval = setInterval(() => {
        DB.aquarium.simulate();
        this.updateKPIs();
      }, 10000);
    },

    refreshData() {
      this.updateKPIs();
      this.renderAlerts();
      this.renderMeasurementsChart();
      this.renderGauges();
      this.renderFish();
    },

    updateKPIs() {
      const plants   = DB.plants.getAll();
      const stressed = plants.filter(p => p.status === 'water_stress').length;
      const sick     = plants.filter(p => ['disease_spots', 'wilting', 'yellow_leaves'].includes(p.status)).length;
      const jarsCount= DB.jars.getAll().length;
      const jarLevel = DB.jars.getAverageLevel();
      const aquarium = DB.aquarium.get();

      this._setKPI('kpi-plants',    plants.length);
      this._setKPI('kpi-stressed',  stressed);
      this._setKPI('kpi-sick',      sick);
      this._setKPI('kpi-jars',      jarsCount);
      this._setKPI('kpi-jar-level', jarLevel + '%');
      this._setKPI('kpi-aqua-level',Math.round(aquarium.level) + '%');
      this._setKPI('kpi-fish',      aquarium.fish_count);
      this._setKPI('kpi-aqua-temp', aquarium.temperature + '°C');
    },

    _setKPI(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    },

    renderAlerts() {
      const el = document.getElementById('alerts-list');
      if (!el) return;

      const measurements = DB.measurements.getLast10();
      const alerts = [];

      measurements.forEach(m => {
        if (m.ai_result === 'water_stress') {
          const plant = DB.plants.getById(m.plant_id);
          alerts.push({ icon: '💧', text: `Stress hydrique: ${plant?.name || 'Plante'}`, time: App.formatDate(m.created_at), severity: 'warning' });
        }
        if (m.ai_result === 'disease_spots') {
          const plant = DB.plants.getById(m.plant_id);
          alerts.push({ icon: '🦠', text: `Maladie détectée: ${plant?.name || 'Plante'}`, time: App.formatDate(m.created_at), severity: 'error' });
        }
      });

      const aquarium = DB.aquarium.get();
      if (aquarium.level < 30) alerts.push({ icon: '🐠', text: 'Niveau aquarium bas', time: 'Maintenant', severity: 'warning' });
      if (aquarium.ph < 6.5 || aquarium.ph > 7.8) alerts.push({ icon: '⚠️', text: `pH hors norme: ${aquarium.ph}`, time: 'Maintenant', severity: 'error' });

      if (!alerts.length) {
        el.innerHTML = '<div class="alert alert-success">✅ Tout est normal. Aucune alerte active.</div>';
        return;
      }

      el.innerHTML = alerts.slice(0, 8).map(a => `
        <div class="alert-item">
          <span class="alert-item-icon">${a.icon}</span>
          <div>
            <div>${a.text}</div>
            <div class="alert-item-time">${a.time}</div>
          </div>
        </div>
      `).join('');
    },

    renderMeasurementsChart() {
      const canvas = document.getElementById('dashboard-chart');
      if (!canvas) return;

      const measurements = DB.measurements.getLast10().reverse();
      if (!measurements.length) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth * dpr;
      canvas.height = 220 * dpr;
      canvas.getContext('2d').scale(dpr, dpr);
      canvas.style.width  = canvas.offsetWidth + 'px';
      canvas.style.height = '220px';

      Charts.drawLine(canvas, {
        labels:   measurements.map((_, i) => `M${i + 1}`),
        datasets: [
          { label: 'Température (°C)', data: measurements.map(m => m.temperature || 0),    color: '#ef5350' },
          { label: 'Hum. sol (%)',     data:  measurements.map(m => m.soil_moisture || 0), color: '#42a5f5' },
          { label: 'Hum. air (%)',     data:  measurements.map(m => m.air_humidity || 0),  color: '#66bb6a' },
        ],
      });
    },

    renderGauges() {
      const jarCanvas  = document.getElementById('gauge-jar');
      const aquaCanvas = document.getElementById('gauge-aqua');

      const jarLevel = DB.jars.getAverageLevel();
      const aquarium = DB.aquarium.get();

      if (jarCanvas) {
        const dpr = window.devicePixelRatio || 1;
        jarCanvas.width  = 140 * dpr;
        jarCanvas.height = 140 * dpr;
        jarCanvas.getContext('2d').scale(dpr, dpr);
        jarCanvas.style.width  = '140px';
        jarCanvas.style.height = '140px';
        Charts.drawGauge(jarCanvas, {
          value: jarLevel,
          max:   100,
          label: 'Réservoir',
          color: '#d84315',
        });
      }

      if (aquaCanvas) {
        const dpr = window.devicePixelRatio || 1;
        aquaCanvas.width  = 140 * dpr;
        aquaCanvas.height = 140 * dpr;
        aquaCanvas.getContext('2d').scale(dpr, dpr);
        aquaCanvas.style.width  = '140px';
        aquaCanvas.style.height = '140px';
        Charts.drawGauge(aquaCanvas, {
          value: aquarium.level,
          max:   100,
          label: 'Aquarium',
          color: '#1565c0',
        });
      }
    },

    renderFish() {
      const container = document.getElementById('aquarium-visual');
      if (!container) return;

      const aq   = DB.aquarium.get();
      const fish = ['🐟', '🐠', '🐡', '🦐'];
      let html   = '';

      for (let i = 0; i < Math.min(aq.fish_count, 8); i++) {
        const fishEmoji = fish[i % fish.length];
        const topPct    = 20 + Math.random() * 60;
        const duration  = 4 + Math.random() * 6;
        const delay     = -Math.random() * 8;
        html += `<div class="fish" style="top:${topPct}%;animation-duration:${duration}s;animation-delay:${delay}s">${fishEmoji}</div>`;
      }
      container.innerHTML = html;

      // Stats aquarium
      const statsEl = document.getElementById('aquarium-stats');
      if (statsEl) {
        statsEl.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.8rem">
            <div><span style="color:var(--text-muted)">pH:</span> <strong>${aq.ph}</strong></div>
            <div><span style="color:var(--text-muted)">Temp:</span> <strong>${aq.temperature}°C</strong></div>
            <div><span style="color:var(--text-muted)">NH₃:</span> <strong>${aq.ammonia} mg/L</strong></div>
            <div><span style="color:var(--text-muted)">NO₃:</span> <strong>${aq.nitrate} mg/L</strong></div>
          </div>
        `;
      }
    },
  },
};

// ══════════════════════════════════════════════════════════════
//   INITIALISATION
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Seed données démo
  DB.seedDemoData();

  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) App.navigate(page);
    });
  });

  // Boutons hero
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.nav;
      if (page) App.navigate(page);
    });
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('mobile-open');
  });

  // Robot buttons
  document.getElementById('btn-start-robot')?.addEventListener('click', () => {
    const plants = DB.plants.getAll().slice(0, 6);
    RobotEngine.start(plants);
    document.getElementById('btn-start-robot').disabled = true;
    document.getElementById('btn-stop-robot')?.removeAttribute('disabled');
  });

  document.getElementById('btn-stop-robot')?.addEventListener('click', () => {
    RobotEngine.stop();
    document.getElementById('btn-stop-robot').disabled = true;
    document.getElementById('btn-start-robot')?.removeAttribute('disabled');
  });

  // Loader → naviguer vers Home
  setTimeout(() => {
    document.getElementById('page-loader')?.classList.add('hidden');
    App.navigate('home');
  }, 1500);
});

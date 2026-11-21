/**
 * SMART JARRA — Charts (Graphiques Canvas)
 * API simple pour dessiner des graphiques sans bibliothèque externe
 */

const Charts = {
  // Couleurs
  COLORS: {
    temperature:  '#ef5350',
    humidity:     '#42a5f5',
    soil:         '#66bb6a',
    light:        '#ffa726',
    primary:      '#2e7d32',
    secondary:    '#1565c0',
    terra:        '#d84315',
  },

  /**
   * Graphique linéaire multi-séries
   * @param {HTMLCanvasElement} canvas
   * @param {Object} config
   */
  drawLine(canvas, config) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const { datasets = [], labels = [], title = '' } = config;
    if (!datasets.length || !labels.length) {
      this._drawEmpty(ctx, width, height, 'Aucune donnée disponible');
      return;
    }

    // Marges
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const plotW  = width  - margin.left - margin.right;
    const plotH  = height - margin.top  - margin.bottom;

    // Min/Max sur toutes les séries
    const allValues = datasets.flatMap(d => d.data);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range  = maxVal - minVal || 1;

    // ── Grille ────────────────────────────────────────────
    ctx.strokeStyle = '#e8f0e8';
    ctx.lineWidth   = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = margin.top + (plotH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();

      // Label axe Y
      const val = maxVal - (range / gridLines) * i;
      ctx.fillStyle = '#7a8e7a';
      ctx.font = '10px Poppins, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(0), margin.left - 6, y + 4);
    }

    // ── Labels axe X ──────────────────────────────────────
    ctx.fillStyle = '#7a8e7a';
    ctx.textAlign = 'center';
    ctx.font = '10px Poppins, sans-serif';
    labels.forEach((label, i) => {
      const x = margin.left + (plotW / (labels.length - 1 || 1)) * i;
      ctx.fillText(label, x, height - margin.bottom + 15);
    });

    // ── Séries de données ─────────────────────────────────
    datasets.forEach(dataset => {
      const { data, color = '#2e7d32', label = '' } = dataset;
      const pts = data.map((val, i) => ({
        x: margin.left + (plotW / (data.length - 1 || 1)) * i,
        y: margin.top + plotH - ((val - minVal) / range) * plotH,
      }));

      // Remplissage dégradé
      const grad = ctx.createLinearGradient(0, margin.top, 0, margin.top + plotH);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, margin.top + plotH);
      pts.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(pts[pts.length - 1].x, margin.top + plotH);
      ctx.closePath();
      ctx.fill();

      // Ligne
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';
      ctx.beginPath();
      pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.stroke();

      // Points
      pts.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle   = 'white';
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.fill();
        ctx.stroke();
      });
    });

    // ── Légende ───────────────────────────────────────────
    if (datasets.length > 1) {
      let legendX = margin.left;
      datasets.forEach(d => {
        ctx.fillStyle   = d.color || '#2e7d32';
        ctx.fillRect(legendX, 8, 16, 3);
        ctx.fillStyle   = '#4a5e4a';
        ctx.font        = '10px Poppins, sans-serif';
        ctx.textAlign   = 'left';
        ctx.fillText(d.label, legendX + 20, 14);
        legendX += ctx.measureText(d.label).width + 40;
      });
    }
  },

  /**
   * Graphique en barres
   */
  drawBar(canvas, config) {
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const { data = [], labels = [], color = '#2e7d32', title = '' } = config;
    if (!data.length) {
      this._drawEmpty(ctx, width, height, 'Aucune donnée');
      return;
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotW  = width  - margin.left - margin.right;
    const plotH  = height - margin.top  - margin.bottom;
    const maxVal = Math.max(...data) || 1;
    const barW   = (plotW / data.length) * 0.6;
    const barGap = (plotW / data.length) * 0.4;

    // Grille
    ctx.strokeStyle = '#e8f0e8';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = margin.top + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();

      const val = maxVal - (maxVal / 4) * i;
      ctx.fillStyle = '#7a8e7a';
      ctx.font = '10px Poppins, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(0), margin.left - 6, y + 4);
    }

    // Barres
    data.forEach((val, i) => {
      const barH = (val / maxVal) * plotH;
      const x    = margin.left + (plotW / data.length) * i + barGap / 2;
      const y    = margin.top + plotH - barH;

      // Dégradé barre
      const grad = ctx.createLinearGradient(0, y, 0, margin.top + plotH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '80');
      ctx.fillStyle = grad;

      // Barre arrondie
      this._roundRect(ctx, x, y, barW, barH, 4);
      ctx.fill();

      // Label
      ctx.fillStyle = '#7a8e7a';
      ctx.font = '9px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i] || '', x + barW / 2, height - margin.bottom + 15);

      // Valeur au-dessus
      ctx.fillStyle = '#4a5e4a';
      ctx.font = 'bold 10px Poppins, sans-serif';
      ctx.fillText(val.toFixed(0), x + barW / 2, y - 4);
    });
  },

  /**
   * Jauge circulaire (gauge)
   */
  drawGauge(canvas, config) {
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const {
      value = 0,
      max   = 100,
      label = '',
      unit  = '%',
      color = '#2e7d32',
    } = config;

    const cx   = width / 2;
    const cy   = height / 2 + 10;
    const r    = Math.min(width, height) / 2 - 15;
    const startAngle = Math.PI * 0.75;
    const endAngle   = Math.PI * 2.25;
    const fillAngle  = startAngle + (endAngle - startAngle) * (value / max);

    // Piste fond
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#e8f0e8';
    ctx.lineWidth   = 12;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Remplissage couleur
    if (value > 0) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, color + 'aa');
      grad.addColorStop(1, color);

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, fillAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 12;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // Valeur
    ctx.fillStyle = '#1a2e1a';
    ctx.font      = `bold ${r * 0.45}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(value)}${unit}`, cx, cy - 6);

    // Label
    ctx.fillStyle = '#7a8e7a';
    ctx.font      = `${r * 0.2}px Poppins, sans-serif`;
    ctx.fillText(label, cx, cy + r * 0.35);
  },

  /**
   * Graphique en anneau (donut)
   */
  drawDonut(canvas, config) {
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const { segments = [], title = '' } = config;
    if (!segments.length) return;

    const cx = width / 2;
    const cy = height / 2;
    const r  = Math.min(cx, cy) - 20;
    const innerR = r * 0.6;

    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let angle = -Math.PI / 2;

    segments.forEach(seg => {
      const slice = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      angle += slice;
    });

    // Cercle intérieur
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Centre texte
    ctx.fillStyle = '#1a2e1a';
    ctx.font = `bold ${innerR * 0.4}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 8);
    ctx.fillStyle = '#7a8e7a';
    ctx.font = `${innerR * 0.22}px Poppins, sans-serif`;
    ctx.fillText(title, cx, cy + innerR * 0.25);
  },

  // ── Helpers ───────────────────────────────────────────
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  _drawEmpty(ctx, w, h, msg) {
    ctx.fillStyle = '#7a8e7a';
    ctx.font = '14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, w / 2, h / 2);
  },

  /**
   * Auto-resize canvas pour DPI élevé
   */
  setupCanvas(canvas) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
  },
};

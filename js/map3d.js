/* ============================================================
   EKRILNA — Interactive 3D Map
   Three.js: Stylized Tunis top-down map with pins, radius, transport
   ============================================================ */
(function() {
  'use strict';

  const canvas = document.getElementById('map-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x07061a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07061a, 40, 90);

  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 150);
  camera.position.set(0, 38, 20);
  camera.lookAt(0, 0, 0);

  // ── Lights ────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x0f0d28, 1));
  const top = new THREE.DirectionalLight(0xffffff, 0.6);
  top.position.set(0, 50, 0);
  scene.add(top);

  const cityGlow = new THREE.PointLight(0x3a5fc4, 3, 50);
  cityGlow.position.set(0, 15, 0);
  scene.add(cityGlow);

  // ── Ground / Grid ─────────────────────────────────────────
  const groundGeo = new THREE.PlaneGeometry(100, 100, 50, 50);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x0c0a22 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Grid lines
  const gridHelper = new THREE.GridHelper(100, 30, 0x1a1640, 0x120f35);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // ── Roads ─────────────────────────────────────────────────
  function addRoad(x, z, w, d, rot = 0) {
    const mat = new THREE.MeshLambertMaterial({ color: 0x16132e });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rot;
    mesh.position.set(x, 0.02, z);
    scene.add(mesh);
  }

  // Main arteries
  addRoad(0, 0, 2.5, 70);   // Vertical main road
  addRoad(0, 0, 70, 2.5, Math.PI / 2); // Horizontal
  addRoad(-12, 0, 1.5, 50); // Secondary
  addRoad(12, 0, 1.5, 50);
  addRoad(0, -10, 40, 1.5, Math.PI / 2);
  addRoad(0, 10, 40, 1.5, Math.PI / 2);

  // ── City blocks ───────────────────────────────────────────
  function addBlock(x, z, w, d, h, color = 0x1a1640) {
    const mat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.04 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, h / 2, z);
    scene.add(mesh);
    return mesh;
  }

  // Neighborhoods
  const blocks = [
    // Lafayette (left)
    [-8, -6, 4, 4, 3, 0x1e1b40], [-10, -12, 5, 3, 5, 0x181535],
    [-15, -8, 3, 3, 4, 0x1c194a], [-14, -15, 4, 5, 2.5, 0x161330],
    [-7,  -15, 3, 4, 6, 0x20194e],

    // Menzah (right)
    [8, -6, 4, 4, 3.5, 0x1e1b40], [10, -12, 5, 3, 5, 0x181535],
    [15, -8, 3, 3, 4, 0x1c194a], [14, -15, 4, 5, 3, 0x161330],
    [7, -15, 3, 4, 6, 0x20194e],

    // El Bardo (back-left)
    [-20, 5, 5, 4, 4, 0x14122c], [-18, 12, 4, 3, 3, 0x1a1740],
    [-22, -3, 3, 5, 5.5, 0x1e1b40], [-25, 8, 4, 4, 2.5, 0x12102a],

    // El Khadra (back-right)
    [20, 5, 5, 4, 4, 0x14122c], [18, 12, 4, 3, 3, 0x1a1740],
    [22, -3, 3, 5, 5.5, 0x1e1b40], [25, 8, 4, 4, 2.5, 0x12102a],

    // Near university
    [-5, 8, 2, 2, 2, 0x201e50], [5, 8, 2, 2, 2, 0x201e50],
    [-4, -5, 2, 2, 1.5, 0x1c1a45], [4, -5, 2, 2, 1.5, 0x1c1a45],
  ];

  blocks.forEach(b => addBlock(...b));

  // ── University (center) ───────────────────────────────────
  const univMat = new THREE.MeshLambertMaterial({ color: 0x2d1f5c, emissive: 0xa63a12, emissiveIntensity: 0.35 });
  const univBody = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 5), univMat);
  univBody.position.set(0, 2, 0);
  scene.add(univBody);

  const domeMat = new THREE.MeshLambertMaterial({ color: 0xa63a12, emissive: 0xa63a12, emissiveIntensity: 0.7 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  dome.position.set(0, 4, 0);
  scene.add(dome);

  const univLight = new THREE.PointLight(0xa63a12, 4, 18);
  univLight.position.set(0, 6, 0);
  scene.add(univLight);

  // ── Radius Circle ─────────────────────────────────────────
  let radiusValue = 2; // km → ~units
  const radiusRingGeo = new THREE.RingGeometry(radiusValue, radiusValue + 0.15, 64);
  const radiusRingMat = new THREE.MeshBasicMaterial({
    color: 0xa63a12,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const radiusRing = new THREE.Mesh(radiusRingGeo, radiusRingMat);
  radiusRing.rotation.x = -Math.PI / 2;
  radiusRing.position.y = 0.03;
  scene.add(radiusRing);

  // Filled circle (transparent)
  const radiusFillGeo = new THREE.CircleGeometry(radiusValue, 64);
  const radiusFillMat = new THREE.MeshBasicMaterial({
    color: 0xa63a12,
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide
  });
  const radiusFill = new THREE.Mesh(radiusFillGeo, radiusFillMat);
  radiusFill.rotation.x = -Math.PI / 2;
  radiusFill.position.y = 0.025;
  scene.add(radiusFill);

  function updateRadius(val) {
    radiusValue = val;
    // Rebuild geometries
    scene.remove(radiusRing);
    scene.remove(radiusFill);
    radiusRing.geometry.dispose();
    radiusFill.geometry.dispose();

    radiusRing.geometry = new THREE.RingGeometry(val, val + 0.18, 64);
    radiusFill.geometry = new THREE.CircleGeometry(val, 64);
    scene.add(radiusRing);
    scene.add(radiusFill);
  }

  // ── Lodging Pins ─────────────────────────────────────────
  const lodgingData = [
    { pos: [-8, 0, -8],  color: 0xa63a12, label: 'Lafayette' },
    { pos: [8, 0, -8],   color: 0xa63a12, label: 'Menzah' },
    { pos: [-6, 0, 6],   color: 0x2d9b6f, label: 'Bardo' },
    { pos: [6, 0, 6],    color: 0x2d9b6f, label: 'El Omrane' },
    { pos: [-14, 0, -4], color: 0xa63a12, label: 'Khadra' },
    { pos: [14, 0, -4],  color: 0xa63a12, label: 'Montplaisir' },
    { pos: [0, 0, -14],  color: 0x2d9b6f, label: 'El Manar' },
    { pos: [-10, 0, 12], color: 0xa63a12, label: 'Carthage' },
    { pos: [10, 0, 12],  color: 0x2d9b6f, label: 'Marsa' },
  ];

  const mapPins = [];

  lodgingData.forEach(({ pos, color }) => {
    const group = new THREE.Group();

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 10, 10),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.9 })
    );
    group.add(head);

    const needle = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.9, 8),
      new THREE.MeshLambertMaterial({ color })
    );
    needle.position.y = -0.6;
    needle.rotation.z = Math.PI;
    group.add(needle);

    const pl = new THREE.PointLight(color, 2, 6);
    group.add(pl);

    // Pulse ring
    const pulseGeo = new THREE.RingGeometry(0.5, 0.65, 24);
    const pulseMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.rotation.x = -Math.PI / 2;
    pulse.position.y = -1.1;
    group.add(pulse);

    group.position.set(...pos);
    group.position.y = 3;
    group.userData.baseY = 3;
    group.userData.phase = Math.random() * Math.PI * 2;
    group.userData.pulseRing = pulse;
    scene.add(group);
    mapPins.push(group);
  });

  // ── Transport path ────────────────────────────────────────
  let transportPath = null;

  const pathColors = {
    'pied':   0x2d9b6f,
    'metro':  0x3a6bc4,
    'bus':    0xf5a623,
    'voiture':0xa63a12
  };

  function drawTransportPath(mode) {
    if (transportPath) {
      scene.remove(transportPath);
      transportPath.geometry.dispose();
      transportPath = null;
    }

    const color = pathColors[mode] || 0xffffff;
    const activePins = mapPins.filter(p => {
      const dx = p.position.x, dz = p.position.z;
      return Math.sqrt(dx * dx + dz * dz) <= radiusValue;
    });

    if (!activePins.length) return;

    // Draw path from university (0,0,0) to first pin in range
    const target = activePins[0].position;
    const points = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = target.x * t;
      const z = target.z * t;
      const y = 0.2 + Math.sin(t * Math.PI) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const pathGeo = new THREE.TubeGeometry(curve, 60, 0.08, 8, false);
    const pathMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
    transportPath = new THREE.Mesh(pathGeo, pathMat);
    scene.add(transportPath);
  }

  // ── Controls UI ───────────────────────────────────────────
  const radiusSlider = document.getElementById('radius-slider');
  const radiusLabel  = document.getElementById('radius-label');

  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const km = (val / 1.5).toFixed(1);
      if (radiusLabel) radiusLabel.textContent = km + ' km';
      updateRadius(val);
    });
  }

  document.querySelectorAll('.transport-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.transport-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawTransportPath(btn.dataset.transport);
    });
  });

  // Default path
  setTimeout(() => drawTransportPath('pied'), 500);

  // ── Resize ────────────────────────────────────────────────
  function onResize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  // ── Animation Loop ────────────────────────────────────────
  let time = 0;
  let isVis = false;

  const observer = new IntersectionObserver(
    ([e]) => { isVis = e.isIntersecting; },
    { threshold: 0.01 }
  );
  observer.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVis) return;
    time += 0.012;

    // Animate pins
    mapPins.forEach((pin, i) => {
      pin.position.y = pin.userData.baseY + Math.sin(time + pin.userData.phase) * 0.4;
      const pulse = pin.userData.pulseRing;
      if (pulse) {
        const s = 1 + (Math.sin(time * 2 + pin.userData.phase) * 0.5 + 0.5) * 2.5;
        pulse.scale.setScalar(s);
        pulse.material.opacity = 0.5 - (s - 1) / 5;
      }
    });

    // Gently rotate camera around scene
    camera.position.x = Math.sin(time * 0.08) * 4;
    camera.position.z = 20 + Math.cos(time * 0.06) * 4;
    camera.lookAt(0, 0, 0);

    // Pulse ring glow
    radiusRingMat.opacity = 0.5 + Math.sin(time * 2) * 0.25;

    // Animate transport path opacity
    if (transportPath) {
      transportPath.material.opacity = 0.6 + Math.sin(time * 3) * 0.3;
    }

    renderer.render(scene, camera);
  }

  animate();

})();

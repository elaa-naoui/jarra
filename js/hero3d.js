/* ============================================================
   EKRILNA — Hero 3D Scene
   Three.js: Low-poly Tunis cityscape with drone camera + particles
   ============================================================ */
(function() {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x0a0814, 1);
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0814, 0.018);

  // ── Camera ────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 18, 32);
  camera.lookAt(0, 0, 0);

  // ── Lights ────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x1a0f2e, 0.8);
  scene.add(ambientLight);

  const sun = new THREE.DirectionalLight(0xfff0e0, 1.4);
  sun.position.set(20, 30, 10);
  scene.add(sun);

  const terra = new THREE.PointLight(0xa63a12, 3.5, 40);
  terra.position.set(-8, 8, -5);
  scene.add(terra);

  const tealLight = new THREE.PointLight(0x2d9b6f, 2.5, 30);
  tealLight.position.set(12, 6, 5);
  scene.add(tealLight);

  const blueLight = new THREE.PointLight(0x3a6bc4, 2, 35);
  blueLight.position.set(0, 15, -15);
  scene.add(blueLight);

  // ── Materials ─────────────────────────────────────────────
  function makeMat(color, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity });
  }

  const matBuilding1 = makeMat(0x1e1a3a, 0x3a2060, 0.15);
  const matBuilding2 = makeMat(0x251d45, 0x2a1850, 0.1);
  const matBuilding3 = makeMat(0x16132e, 0x1a1040, 0.08);
  const matUniv      = makeMat(0x2d1f5c, 0xa63a12, 0.25);
  const matGround    = makeMat(0x0e0b1e);
  const matRoad      = makeMat(0x13102a);
  const matTree      = makeMat(0x1a4a2e, 0x2d9b6f, 0.1);

  // ── Ground plane ─────────────────────────────────────────
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120, 1, 1),
    matGround
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  // Roads
  [[0, 0, 80, 2], [0, 0, 2, 80]].forEach(([x, z, w, d]) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), matRoad);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.01, z);
    scene.add(road);
  });

  // ── Building helper ───────────────────────────────────────
  function addBuilding(x, z, w, d, h, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, z);
    scene.add(mesh);
    return mesh;
  }

  // ── City Layout ───────────────────────────────────────────
  // University (central landmark)
  const univGroup = new THREE.Group();

  // Main university building
  const univMain = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 6), matUniv);
  univMain.position.set(0, 3, 0);
  univGroup.add(univMain);

  // Dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: 0xa63a12, emissive: 0xa63a12, emissiveIntensity: 0.4 })
  );
  dome.position.set(0, 6, 0);
  univGroup.add(dome);

  // Wings
  const wing1 = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 8), matUniv);
  wing1.position.set(-5.5, 2, 0);
  univGroup.add(wing1);

  const wing2 = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 8), matUniv);
  wing2.position.set(5.5, 2, 0);
  univGroup.add(wing2);

  scene.add(univGroup);

  // Glow ring under university
  const ringGeo = new THREE.RingGeometry(6, 7, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa63a12, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);

  // Neighborhood buildings
  const buildingData = [
    // Left district
    [-18, -12, 4, 4, 8, matBuilding1],
    [-14, -8,  3, 3, 5, matBuilding2],
    [-22, -8,  5, 3, 12, matBuilding1],
    [-16, -16, 3, 5, 6, matBuilding3],
    [-24, -16, 4, 4, 9, matBuilding2],
    [-10, -14, 3, 3, 4, matBuilding3],

    // Right district
    [18, -12, 4, 4, 10, matBuilding2],
    [14, -8,  3, 3, 6, matBuilding1],
    [22, -8,  5, 3, 8, matBuilding3],
    [16, -16, 3, 5, 5, matBuilding1],
    [24, -16, 4, 4, 14, matBuilding2],
    [10, -14, 3, 3, 7, matBuilding3],

    // Back district
    [-12, 14, 3, 4, 9, matBuilding1],
    [0,   16, 5, 3, 7, matBuilding2],
    [12,  14, 3, 4, 11, matBuilding3],
    [-5,  18, 3, 3, 5, matBuilding1],
    [5,   18, 3, 3, 6, matBuilding2],
    [-18, 10, 4, 4, 8, matBuilding3],
    [18,  10, 4, 4, 10, matBuilding1],

    // Close buildings
    [-8, -5,  2, 2, 4, matBuilding2],
    [8,  -5,  2, 2, 3, matBuilding3],
    [-5, 8,   2, 2, 5, matBuilding1],
    [5,  8,   2, 2, 4, matBuilding2],
  ];

  buildingData.forEach(d => addBuilding(...d));

  // ── Trees ────────────────────────────────────────────────
  const treePositions = [
    [-6, 8], [6, 8], [-8, -2], [8, -2],
    [-20, 0], [20, 0], [0, -18], [-15, 5], [15, 5]
  ];

  treePositions.forEach(([x, z]) => {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6),
      new THREE.MeshLambertMaterial({ color: 0x3d2b1f })
    );
    trunk.position.set(x, 0.75, z);
    scene.add(trunk);

    const top = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 2.5, 7),
      matTree
    );
    top.position.set(x, 2.5, z);
    scene.add(top);
  });

  // ── Location Pins (floating) ──────────────────────────────
  const pins = [];
  const pinPositions = [
    [-18, 10, -12], [18, 10, -12], [-8, 6, -5],
    [8, 6, -5], [-14, 8, 14], [12, 9, 14], [0, 12, -16]
  ];

  const pinColors = [0xa63a12, 0x2d9b6f, 0xa63a12, 0x2d9b6f, 0xa63a12, 0x2d9b6f, 0xffffff];

  pinPositions.forEach(([x, y, z], i) => {
    const group = new THREE.Group();

    // Pin head
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 12, 12),
      new THREE.MeshLambertMaterial({ color: pinColors[i], emissive: pinColors[i], emissiveIntensity: 0.6 })
    );
    group.add(sphere);

    // Pin needle
    const needle = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 1.2, 8),
      new THREE.MeshLambertMaterial({ color: pinColors[i] })
    );
    needle.position.y = -0.8;
    needle.rotation.z = Math.PI;
    group.add(needle);

    // Glow
    const glow = new THREE.PointLight(pinColors[i], 1.5, 8);
    group.add(glow);

    group.position.set(x, y, z);
    group.userData.baseY = y;
    group.userData.phase = Math.random() * Math.PI * 2;
    scene.add(group);
    pins.push(group);
  });

  // ── Particles ────────────────────────────────────────────
  const particleCount = 400;
  const pPositions = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 80;
    pPositions[i * 3 + 1] = Math.random() * 30 + 2;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    pSizes[i] = Math.random() * 2.5 + 0.5;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

  const pMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.18,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Mouse parallax ────────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  const targetCam = { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ────────────────────────────────────────────────
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);
  onResize();

  // ── Animation Loop ────────────────────────────────────────
  let time = 0;
  let animId = null;
  let isVisible = true;

  const observer = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting; },
    { threshold: 0.01 }
  );
  observer.observe(canvas);

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;

    time += 0.005;

    // Slow drone drift
    const baseCamX = Math.sin(time * 0.3) * 3;
    const baseCamY = 18 + Math.sin(time * 0.2) * 1.5;
    const baseCamZ = 32 + Math.cos(time * 0.25) * 2;

    // Mouse parallax
    targetCam.x += (mouse.x * 5 - targetCam.x) * 0.04;
    targetCam.y += (mouse.y * -3 - targetCam.y) * 0.04;

    camera.position.x += (baseCamX + targetCam.x - camera.position.x) * 0.02;
    camera.position.y += (baseCamY + targetCam.y - camera.position.y) * 0.02;
    camera.position.z += (baseCamZ - camera.position.z) * 0.02;
    camera.lookAt(targetCam.x * 0.3, 2, 0);

    // Animate pins
    pins.forEach((pin, i) => {
      pin.position.y = pin.userData.baseY + Math.sin(time * 1.5 + pin.userData.phase) * 0.5;
      pin.rotation.y = time * 0.3;
    });

    // Animate lights
    terra.position.x = Math.sin(time * 0.7) * 12;
    terra.position.z = Math.cos(time * 0.5) * 8;
    tealLight.position.x = Math.cos(time * 0.6) * 14;
    tealLight.position.z = Math.sin(time * 0.4) * 10;

    // Rotate particles slowly
    particles.rotation.y = time * 0.02;

    // Pulse glow ring
    ring.material.opacity = 0.1 + Math.sin(time * 2) * 0.06;

    renderer.render(scene, camera);
  }

  animate();

  // Expose for CTA final section to share
  window.EKRILNA = window.EKRILNA || {};
  window.EKRILNA.heroScene  = scene;
  window.EKRILNA.heroCamera = camera;
  window.EKRILNA.heroRenderer = renderer;

})();

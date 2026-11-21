/* ============================================================
   EKRILNA — Match Section & Apartment 3D Visualisation
   Score ring animation + Three.js apartment floorplan
   ============================================================ */
(function() {
  'use strict';

  // ── Score Ring Animation ──────────────────────────────────
  function animateScore() {
    const fill = document.querySelector('.score-ring-fill');
    const numEl = document.querySelector('.score-number');
    if (!fill || !numEl) return;

    const total = 251.3; // circumference for r=40
    const targetPct = 0.92;
    const duration = 2200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const offset = total - (total * targetPct * eased);
      fill.style.strokeDashoffset = offset;
      numEl.textContent = Math.round(eased * 92) + '%';
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // Export for scrollAnimations.js
  window.EKRILNA = window.EKRILNA || {};
  window.EKRILNA.animateScore = animateScore;

  // ── Apartment 3D Visualisation ────────────────────────────
  const aptCanvas = document.getElementById('apt-canvas');
  if (!aptCanvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas: aptCanvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(aptCanvas.clientWidth, aptCanvas.clientHeight);
  renderer.setClearColor(0xf0ece6, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, aptCanvas.clientWidth / aptCanvas.clientHeight, 0.1, 100);
  camera.position.set(8, 10, 14);
  camera.lookAt(0, 1, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0xfff5e8, 0.9);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff0d0, 1.6);
  sun.position.set(10, 20, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const fill = new THREE.PointLight(0xffffff, 1, 30);
  fill.position.set(-8, 8, -5);
  scene.add(fill);

  // ── Floor ─────────────────────────────────────────────────
  const floorMat = new THREE.MeshLambertMaterial({ color: 0xe8ddd0 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // ── Walls ─────────────────────────────────────────────────
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xf5f0ea, transparent: true, opacity: 0.55 });
  const wallMatSolid = new THREE.MeshLambertMaterial({ color: 0xddd5c8 });

  function addWall(x, z, w, h, d, mat = wallMatSolid) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  // Outer walls (partial for visibility)
  addWall(0, -6, 14, 2.8, 0.18);   // front
  addWall(0,  6, 14, 2.8, 0.18);   // back
  addWall(-7, 0, 0.18, 2.8, 12);   // left
  addWall(7,  0, 0.18, 2.8, 12);   // right

  // Internal walls
  addWall(0,  1, 14, 2.8, 0.15, wallMat);   // horizontal divider
  addWall(1, -2.5, 0.15, 2.8, 5, wallMat);  // vertical divider living/kitchen

  // ── Furniture ─────────────────────────────────────────────
  function addBox(x, y, z, w, h, d, color) {
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }

  // Living room: sofa
  addBox(-3.5, 0.4, -2.5, 3.5, 0.6, 1.2, 0xb0968a);
  addBox(-3.5, 0.9, -3,   3.5, 0.8, 0.25, 0xa08878); // back
  addBox(-5.1, 0.7, -2.5, 0.25, 0.8, 1.2, 0xa08878); // arm

  // Coffee table
  addBox(-3.2, 0.22, -1.2, 1.8, 0.12, 0.9, 0x7a6b5a);

  // TV stand
  addBox(-3.5, 0.2, -5.5, 4, 0.35, 0.5, 0x4a3f35);

  // Bedroom: bed
  addBox(4, 0.35, -3, 3, 0.35, 2.2, 0xd4c4b0);
  addBox(4, 0.68, -3, 3, 0.3, 2.2, 0xf0e8e0); // mattress
  addBox(4, 0.9, -4, 3, 0.5, 0.2, 0xc8b8a8); // headboard

  // Desk
  addBox(5.5, 0.4, -0.5, 1.5, 0.12, 0.9, 0x6b5d50);
  // Chair
  addBox(5.5, 0.2, 0.4, 0.7, 0.25, 0.7, 0x5c4e45);

  // Kitchen
  addBox(-5, 0.5, 2.5, 0.6, 0.8, 3, 0xd0c5b5); // counter
  addBox(-5, 1.0, 4.5, 1.5, 0.06, 0.7, 0xc8bba8); // counter extension

  // Bathroom
  addBox(5, 0.3, 3.5, 1.4, 0.35, 0.8, 0xdde8f0); // bathtub
  addBox(5, 0.42, 4.8, 0.6, 0.7, 0.45, 0xe8f0f5); // toilet

  // ── Room Labels (sprites) ─────────────────────────────────
  function makeLabel(text, x, y, z) {
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 200;
    canvas2d.height = 60;
    const ctx = canvas2d.getContext('2d');
    ctx.fillStyle = 'rgba(10,8,20,0.7)';
    ctx.beginPath();
    ctx.roundRect(4, 4, 192, 52, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 100, 30);

    const texture = new THREE.CanvasTexture(canvas2d);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2, 0.6, 1);
    sprite.position.set(x, y, z);
    scene.add(sprite);
  }

  makeLabel('Salon', -3.5, 2.2, -2.5);
  makeLabel('Chambre', 4, 2.2, -3);
  makeLabel('Cuisine', -4.8, 2.2, 2.8);
  makeLabel('Salle de bain', 5, 2.2, 4);

  // ── OrbitControls (manual simple version) ─────────────────
  let isDragging = false;
  let lastMouse = { x: 0, y: 0 };
  let spherical = { theta: 0.55, phi: 0.85, radius: 20 };

  aptCanvas.addEventListener('mousedown', e => {
    isDragging = true;
    lastMouse = { x: e.clientX, y: e.clientY };
    aptCanvas.style.cursor = 'grabbing';
  });

  aptCanvas.addEventListener('touchstart', e => {
    isDragging = true;
    lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  window.addEventListener('mouseup', () => { isDragging = false; aptCanvas.style.cursor = 'grab'; });
  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    lastMouse = { x: e.clientX, y: e.clientY };
    spherical.theta -= dx * 0.008;
    spherical.phi   = Math.max(0.2, Math.min(1.4, spherical.phi + dy * 0.008));
  });

  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - lastMouse.x;
    const dy = e.touches[0].clientY - lastMouse.y;
    lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    spherical.theta -= dx * 0.01;
    spherical.phi   = Math.max(0.2, Math.min(1.4, spherical.phi + dy * 0.01));
  }, { passive: true });

  aptCanvas.addEventListener('wheel', e => {
    e.preventDefault();
    spherical.radius = Math.max(10, Math.min(30, spherical.radius + e.deltaY * 0.02));
  }, { passive: false });

  // ── Resize ────────────────────────────────────────────────
  function onResize() {
    renderer.setSize(aptCanvas.clientWidth, aptCanvas.clientHeight, false);
    camera.aspect = aptCanvas.clientWidth / aptCanvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  // ── Auto-rotate if not dragging ───────────────────────────
  let autoRotate = true;
  aptCanvas.addEventListener('mousedown', () => { autoRotate = false; });
  setTimeout(() => { autoRotate = true; }, 5000);

  // ── Animation Loop ────────────────────────────────────────
  let time = 0;
  let isVis = false;

  const obs = new IntersectionObserver(([e]) => { isVis = e.isIntersecting; }, { threshold: 0.1 });
  obs.observe(aptCanvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVis) return;
    time += 0.01;

    if (!isDragging && autoRotate) {
      spherical.theta += 0.003;
    }

    const sinPhi = Math.sin(spherical.phi);
    camera.position.x = spherical.radius * sinPhi * Math.sin(spherical.theta);
    camera.position.y = spherical.radius * Math.cos(spherical.phi) + 1;
    camera.position.z = spherical.radius * sinPhi * Math.cos(spherical.theta);
    camera.lookAt(0, 1, 0);

    renderer.render(scene, camera);
  }

  animate();

})();

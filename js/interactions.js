/* ============================================================
   EKRILNA — Interactions
   Custom cursor · Tilt cards · Micro-interactions · CTA canvas
   ============================================================ */
(function() {
  'use strict';

  // ── Custom Cursor ─────────────────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    let cx = -100, cy = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      cx = e.clientX;
      cy = e.clientY;
    });

    // Smooth ring lerp
    function animateCursor() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursor.style.left     = cx + 'px';
      cursor.style.top      = cy + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverTargets = document.querySelectorAll(
      'a, button, .btn, .glass-card, .pillar-card, .problem-card, .testi-card, .partner-card, .transport-btn, .carousel-btn, .lang-btn, .cta-main-btn'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  // ── Tilt Effect on Glass Cards ────────────────────────────
  const tiltCards = document.querySelectorAll(
    '.pillar-card, .testi-card, .glass-card, .problem-card'
  );

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotY = dx * 8;
      const rotX = -dy * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ── Button ripple ─────────────────────────────────────────
  document.querySelectorAll('.btn, .cta-main-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-expand 0.55s ease-out forwards;
        pointer-events: none;
      `;

      this.style.overflow = 'hidden';
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ── Mobile Nav Toggle ─────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-links');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = isOpen ? '' : 'flex';
      mobileMenu.style.flexDirection = 'column';
      mobileMenu.style.position = 'absolute';
      mobileMenu.style.top = '100%';
      mobileMenu.style.left = '0';
      mobileMenu.style.right = '0';
      mobileMenu.style.background = 'rgba(253,248,243,0.97)';
      mobileMenu.style.backdropFilter = 'blur(20px)';
      mobileMenu.style.padding = '1.5rem 2rem';
      mobileMenu.style.borderTop = '1px solid rgba(0,0,0,0.06)';
      mobileMenu.style.gap = '1.5rem';
      mobileMenu.style.zIndex = '400';
    });
  }

  // ── CTA Final Canvas (reuse hero renderer) ────────────────
  // Mirror the hero scene into the CTA canvas using a second renderer
  const ctaCanvas = document.getElementById('cta-canvas');
  if (ctaCanvas && typeof THREE !== 'undefined') {
    // Wait for hero to be ready
    setTimeout(() => {
      const heroScene    = window.EKRILNA && window.EKRILNA.heroScene;
      const heroCamera   = window.EKRILNA && window.EKRILNA.heroCamera;

      if (!heroScene) return;

      const ctaRenderer = new THREE.WebGLRenderer({
        canvas: ctaCanvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      ctaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      ctaRenderer.setClearColor(0x0a0814, 1);

      const ctaCamera = new THREE.PerspectiveCamera(55, ctaCanvas.clientWidth / ctaCanvas.clientHeight, 0.1, 200);
      ctaCamera.position.set(-10, 22, 28);
      ctaCamera.lookAt(0, 0, 0);

      function onCtaResize() {
        ctaRenderer.setSize(ctaCanvas.clientWidth, ctaCanvas.clientHeight, false);
        ctaCamera.aspect = ctaCanvas.clientWidth / ctaCanvas.clientHeight;
        ctaCamera.updateProjectionMatrix();
      }
      window.addEventListener('resize', onCtaResize);
      onCtaResize();

      let ctaTime = 0;
      let ctaVis = false;

      const ctaObs = new IntersectionObserver(([e]) => { ctaVis = e.isIntersecting; }, { threshold: 0.01 });
      ctaObs.observe(ctaCanvas);

      function ctaLoop() {
        requestAnimationFrame(ctaLoop);
        if (!ctaVis) return;
        ctaTime += 0.004;
        ctaCamera.position.x = Math.sin(ctaTime * 0.3) * 12;
        ctaCamera.position.z = 28 + Math.cos(ctaTime * 0.25) * 4;
        ctaCamera.position.y = 22 + Math.sin(ctaTime * 0.2) * 2;
        ctaCamera.lookAt(0, 2, 0);
        ctaRenderer.render(heroScene, ctaCamera);
      }

      ctaLoop();
    }, 1200);
  }

  // ── Smooth anchor scrolling ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active nav link highlight ─────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  // ── Lazy init 3D scenes ───────────────────────────────────
  // Pause particles canvas when not visible (hero already handles this)
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    // Add a subtle gradient CSS bg as instant paint while Three.js loads
    heroCanvas.style.background = 'linear-gradient(160deg, #0d0b1e 0%, #1a1228 40%, #0a1628 100%)';
  }

})();

/* ============================================================
   EKRILNA — Scroll Animations
   GSAP + ScrollTrigger: reveals, parallax, section transitions
   ============================================================ */
(function() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Default reveal config ─────────────────────────────────
  const revealDefaults = {
    opacity: 0,
    y: 50,
    duration: 0.85,
    ease: 'power3.out'
  };

  // ── Utility: stagger reveal ───────────────────────────────
  function revealGroup(selector, trigger, stagger = 0.12, fromVars = {}) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 40, ...fromVars },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || elements[0],
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ── Navbar scroll behavior ────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 80,
      onEnter: () => navbar.classList.add('scrolled'),
      onLeaveBack: () => navbar.classList.remove('scrolled')
    });
  }

  // ── SECTION 2 — Problem ───────────────────────────────────
  // Dark section cinematic wipe
  const problemSection = document.getElementById('problem');
  if (problemSection) {
    gsap.fromTo(problemSection, 
      { '--clip': '0%' },
      {
        scrollTrigger: {
          trigger: '#problem',
          start: 'top bottom',
          end: 'top 30%',
          scrub: 1
        }
      }
    );

    revealGroup('.problem-card', '#problem', 0.15, { scale: 0.92 });

    gsap.from('.problem-intro h2', {
      opacity: 0, y: 40,
      scrollTrigger: { trigger: '.problem-intro', start: 'top 80%' },
      duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.problem-intro p', {
      opacity: 0, y: 25,
      scrollTrigger: { trigger: '.problem-intro', start: 'top 78%' },
      duration: 0.7, ease: 'power3.out', delay: 0.15
    });
  }

  // ── SECTION 3 — Solution ─────────────────────────────────
  const solutionSection = document.getElementById('solution');
  if (solutionSection) {
    gsap.from('.solution-center-card', {
      opacity: 0, scale: 0.9, y: 60,
      scrollTrigger: { trigger: '.solution-center-card', start: 'top 82%' },
      duration: 1, ease: 'power4.out'
    });

    revealGroup('.pillar-card', '.solution-grid', 0.1, { scale: 0.88, y: 30 });
  }

  // ── SECTION 4 — Map header ────────────────────────────────
  const mapSection = document.getElementById('map-section');
  if (mapSection) {
    gsap.from('.map-header', {
      opacity: 0, y: -30,
      scrollTrigger: { trigger: '#map-section', start: 'top 80%' },
      duration: 0.8, ease: 'power3.out'
    });

    gsap.from('.map-controls', {
      opacity: 0, y: 30,
      scrollTrigger: { trigger: '#map-section', start: 'top 80%' },
      duration: 0.8, ease: 'power3.out', delay: 0.2
    });
  }

  // ── SECTION 5 — Match ────────────────────────────────────
  const matchSection = document.getElementById('match');
  if (matchSection) {
    gsap.from('.match-info', {
      opacity: 0, y: 50,
      scrollTrigger: { trigger: '#match', start: 'top 75%' },
      duration: 0.9, ease: 'power3.out'
    });

    gsap.from('.phone-mockup', {
      opacity: 0, scale: 0.85, rotationY: -15,
      scrollTrigger: { trigger: '#match', start: 'top 70%' },
      duration: 1.1, ease: 'back.out(1.4)'
    });

    gsap.from('.profile-card:first-of-type', {
      opacity: 0, x: -60,
      scrollTrigger: { trigger: '#match', start: 'top 72%' },
      duration: 0.9, ease: 'power3.out', delay: 0.2
    });

    gsap.from('.profile-card:last-of-type', {
      opacity: 0, x: 60,
      scrollTrigger: { trigger: '#match', start: 'top 72%' },
      duration: 0.9, ease: 'power3.out', delay: 0.2
    });

    // Score ring animation
    ScrollTrigger.create({
      trigger: '#match',
      start: 'top 65%',
      once: true,
      onEnter: () => {
        if (window.EKRILNA && window.EKRILNA.animateScore) {
          window.EKRILNA.animateScore();
        }
      }
    });
  }

  // ── SECTION 6 — Visualisation ────────────────────────────
  const vizSection = document.getElementById('viz3d');
  if (vizSection) {
    gsap.from('.viz-text', {
      opacity: 0, x: -60,
      scrollTrigger: { trigger: '#viz3d', start: 'top 78%' },
      duration: 0.9, ease: 'power3.out'
    });

    gsap.from('#apt-canvas', {
      opacity: 0, scale: 0.92, x: 50,
      scrollTrigger: { trigger: '#viz3d', start: 'top 78%' },
      duration: 1, ease: 'power3.out', delay: 0.15
    });
  }

  // ── SECTION 7 — Partners ─────────────────────────────────
  const partnersSection = document.getElementById('partners');
  if (partnersSection) {
    gsap.from('.carousel-3d', {
      opacity: 0, y: 60,
      scrollTrigger: { trigger: '#partners', start: 'top 78%' },
      duration: 0.9, ease: 'power3.out', delay: 0.1
    });
  }

  // ── SECTION 8 — Testimonials ─────────────────────────────
  const testiSection = document.getElementById('testimonials');
  if (testiSection) {
    revealGroup('.testi-card', '#testimonials', 0.15);
    revealGroup('.trust-badge', '.trust-badges', 0.08);

    // Animate stars when visible
    ScrollTrigger.create({
      trigger: '#testimonials',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.star').forEach((star, i) => {
          setTimeout(() => star.classList.add('lit'), i * 60);
        });
      }
    });
  }

  // ── SECTION 9 — CTA Final ────────────────────────────────
  const ctaSection = document.getElementById('cta-final');
  if (ctaSection) {
    gsap.from('.cta-content', {
      opacity: 0, y: 60,
      scrollTrigger: { trigger: '#cta-final', start: 'top 75%' },
      duration: 1, ease: 'power3.out'
    });

    // Animated stat counters
    ScrollTrigger.create({
      trigger: '#cta-final',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 2.2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                el.innerText = Math.floor(this.targets()[0].innerText).toLocaleString('fr-FR') + suffix;
              }
            }
          );
        });
      }
    });
  }

  // ── Parallax: section backgrounds ────────────────────────
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      yPercent: speed * -50,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ── Section overline reveals ──────────────────────────────
  gsap.utils.toArray('.section-header').forEach(header => {
    const overline = header.querySelector('.overline');
    const heading  = header.querySelector('h2');
    const para     = header.querySelector('p');

    if (overline) gsap.from(overline, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: header, start: 'top 82%' } });
    if (heading)  gsap.from(heading,  { opacity: 0, y: 35, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: header, start: 'top 80%' }, delay: 0.1 });
    if (para)     gsap.from(para,     { opacity: 0, y: 25, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: header, start: 'top 78%' }, delay: 0.2 });
  });

})();

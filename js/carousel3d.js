/* ============================================================
   EKRILNA — 3D Partner Card Carousel
   CSS 3D perspective carousel with auto-rotate
   ============================================================ */
(function() {
  'use strict';

  const inner = document.querySelector('.carousel-3d-inner');
  if (!inner) return;

  const cards = Array.from(inner.querySelectorAll('.partner-card'));
  const total = cards.length;
  if (!total) return;

  let current = 0;
  let autoPlayId = null;

  // Position cards in a circle
  function positionCards() {
    const angle = 360 / total;
    const radius = Math.max(320, window.innerWidth * 0.22);

    cards.forEach((card, i) => {
      const theta = (i - current) * angle;
      const rad   = theta * Math.PI / 180;
      const x     = Math.sin(rad) * radius;
      const z     = Math.cos(rad) * radius - radius;
      const scale = 0.72 + (1 - Math.abs(Math.sin(rad))) * 0.28;
      const opacity = 0.4 + (1 - Math.abs(Math.sin(rad))) * 0.6;
      const zIndex  = Math.round(scale * 10);

      card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      card.style.opacity   = opacity;
      card.style.zIndex    = zIndex;
      card.classList.toggle('active-card', i === current);
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    positionCards();
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Dots
  const dotsWrap = document.querySelector('.carousel-dots');
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Buttons
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  // Card click
  cards.forEach((card, i) => {
    card.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Auto-play
  function startAuto() {
    autoPlayId = setInterval(next, 3200);
  }

  function resetAuto() {
    clearInterval(autoPlayId);
    startAuto();
  }

  // Touch/swipe
  let touchStartX = 0;
  const carousel = document.querySelector('.carousel-3d');
  if (carousel) {
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx > 0 ? prev() : next();
        resetAuto();
      }
    }, { passive: true });
  }

  // Resize
  window.addEventListener('resize', positionCards);

  // Init
  positionCards();
  startAuto();

})();

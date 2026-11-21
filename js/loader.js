/* ============================================================
   EKRILNA — Loader
   Letter-by-letter build + progress bar
   ============================================================ */
(function() {
  'use strict';

  const letters = document.querySelectorAll('.loader-letter');
  const progressFill = document.querySelector('.loader-progress-fill');
  const loader = document.getElementById('loader');

  let progress = 0;

  // Animate letters in sequence
  letters.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 85);
  });

  // Simulate loading progress
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress > 100) progress = 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(hideLoader, 300);
    }
  }, 80);

  // Force hide after max time
  const maxTimer = setTimeout(hideLoader, 3500);

  function hideLoader() {
    clearTimeout(maxTimer);
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }
  }

  // Export for hero3d to call when ready
  window.EKRILNA = window.EKRILNA || {};
  window.EKRILNA.hideLoader = hideLoader;
})();

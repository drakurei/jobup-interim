/**
 * Parallax.js — parallaxe douce des éléments [data-parallax], pilotée par Lenis.
 * data-parallax = vitesse (ex: 0.06). Désactivé si Lenis absent (reduced-motion).
 */

/**
 * @param {{ lenis?: object|null }} options
 * @returns {() => void}
 */
export function initParallax({ lenis } = {}) {
  const items = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!items.length || !lenis || typeof lenis.on !== 'function') return () => {};

  const apply = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.08;
      const rect = el.getBoundingClientRect();
      const fromCenter = (rect.top + rect.height / 2) - vh / 2;
      el.style.transform = `translate3d(0, ${(-fromCenter * speed).toFixed(1)}px, 0)`;
    });
  };

  lenis.on('scroll', apply);
  apply();

  return () => { if (typeof lenis.off === 'function') lenis.off('scroll', apply); };
}

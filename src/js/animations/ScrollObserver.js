/**
 * ScrollObserver.js — révèle les éléments [data-reveal] à l'entrée du viewport.
 *
 * IntersectionObserver + GSAP. Apparition douce (fade + montée + léger scale).
 * Par défaut l'élément est révélé d'un bloc (cartes toujours alignées).
 * [data-reveal-stagger] permet d'animer les enfants en cascade si voulu.
 * Respecte prefers-reduced-motion.
 */

import { gsap } from 'gsap';

const REDUCED = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {{ root?: Element|null, threshold?: number }} options
 * @returns {() => void}
 */
export function observeReveals({ root = null, threshold = 0.15 } = {}) {
  const targets = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
  if (REDUCED || !targets.length || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return () => {};
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-revealed');
        obs.unobserve(el);

        const stagger = parseFloat(el.dataset.revealStagger || 0);
        if (stagger > 0 && el.children.length) {
          gsap.from(el.children, {
            y: 44, opacity: 0, duration: 0.9, stagger, ease: 'expo.out',
          });
        } else {
          gsap.from(el, {
            y: 48, opacity: 0, scale: 0.985, duration: 1.0,
            ease: 'expo.out', transformOrigin: '50% 100%',
          });
        }
      });
    },
    { root, threshold, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => obs.observe(el));
  return () => obs.disconnect();
}

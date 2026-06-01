/**
 * Parallax.js — parallaxe scroll-driven via GSAP ScrollTrigger (scrub).
 *
 * Plus fluide que les calculs manuels, parfaitement synchro avec Lenis
 * grâce au bridge ScrollTrigger.update() dans SmoothScroll.js.
 *
 * Usage : <img data-parallax="0.15"> où 0.15 = intensité (yPercent négatif).
 * L'élément doit avoir un conteneur en overflow:hidden et une hauteur
 * supérieure à 100% pour avoir du tampon (ex: height: 132%; top: -16%).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * @returns {() => void}
 */
export function initParallax() {
  const items = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!items.length) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};

  const tweens = items.map((el) => {
    const intensity = parseFloat(el.dataset.parallax) || 0.15;
    // Si l'élément est positionné en absolu, prendre son parent comme trigger
    // (sinon getBoundingClientRect peut donner des positions trompeuses).
    const isAbs = getComputedStyle(el).position === 'absolute';
    const trigger = isAbs ? el.parentElement : el;
    return gsap.to(el, {
      yPercent: -intensity * 100,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });

  return () => tweens.forEach((t) => {
    if (t.scrollTrigger) t.scrollTrigger.kill();
    t.kill();
  });
}

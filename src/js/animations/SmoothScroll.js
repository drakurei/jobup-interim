/**
 * SmoothScroll.js — Lenis (smooth scroll) intégré officiellement à GSAP ScrollTrigger.
 *
 * Pattern recommandé GSAP :
 *   1. Enregistrer ScrollTrigger une fois.
 *   2. À chaque scroll Lenis → ScrollTrigger.update()
 *   3. gsap.ticker pilote lenis.raf (un seul rAF central).
 *   4. lagSmoothing(0) pour scroll fluide même sous charge.
 *
 * Désactivé si prefers-reduced-motion.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {{ enabled?: boolean }} options
 * @returns {{ lenis: Lenis|null, dispose: () => void }}
 */
export function initSmoothScroll({ enabled = true } = {}) {
  if (!enabled) return { lenis: null, dispose: () => {} };

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.1,
  });

  // Bridge Lenis ↔ ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  const tickerCb = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerCb);
  gsap.ticker.lagSmoothing(0);

  const dispose = () => {
    lenis.off('scroll', ScrollTrigger.update);
    gsap.ticker.remove(tickerCb);
    lenis.destroy();
  };

  return { lenis, dispose };
}

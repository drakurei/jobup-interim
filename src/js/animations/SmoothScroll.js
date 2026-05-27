/**
 * SmoothScroll.js — wrapper Lenis pour smooth scroll natif 60fps.
 * Désactivé si prefers-reduced-motion.
 */

import Lenis from 'lenis';

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

  let rafId = 0;
  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  const dispose = () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  };

  return { lenis, dispose };
}

/**
 * TiltEffect.js — incline une carte en 3D selon la position de la souris.
 * Utilisé pour les JobCard. Désactivé sur écrans tactiles.
 */

import { damp } from './Easings.js';

const DEFAULTS = { maxTilt: 8, perspective: 1200, scale: 1.02 };

/**
 * @param {HTMLElement | NodeListOf<HTMLElement>} elements
 * @param {Partial<typeof DEFAULTS>} options
 * @returns {() => void}
 */
export function bindTilt(elements, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const list = elements.length !== undefined ? Array.from(elements) : [elements];
  const states = new WeakMap();
  let rafId = 0;
  let lastT = performance.now();

  list.forEach((el) => {
    if (!el) return;
    el.style.perspective = `${opts.perspective}px`;
    el.style.transformStyle = 'preserve-3d';
    states.set(el, {
      rotX: 0, rotY: 0,
      targetX: 0, targetY: 0,
      scale: 1, targetScale: 1,
    });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      const s = states.get(el);
      s.targetX = -my * 2 * opts.maxTilt;
      s.targetY =  mx * 2 * opts.maxTilt;
      s.targetScale = opts.scale;
    };
    const onLeave = () => {
      const s = states.get(el);
      s.targetX = 0; s.targetY = 0; s.targetScale = 1;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });

  const tick = (now) => {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    list.forEach((el) => {
      const s = states.get(el);
      if (!s) return;
      s.rotX = damp(s.rotX, s.targetX, 10, dt);
      s.rotY = damp(s.rotY, s.targetY, 10, dt);
      s.scale = damp(s.scale, s.targetScale, 10, dt);
      el.style.transform = `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg) scale(${s.scale})`;
    });
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}

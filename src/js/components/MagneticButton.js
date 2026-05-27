/**
 * MagneticButton.js — effet magnétique réutilisable.
 *
 * Sur tout élément ciblé, déplace doucement le contenu vers le curseur
 * quand il entre dans un rayon défini, et le ramène à sa position d'origine
 * avec un easing ressort à la sortie.
 *
 * Usage HTML :
 *   <a class="btn" data-magnetic>
 *     <span class="btn__inner">Voir les offres</span>
 *   </a>
 *
 * Usage JS :
 *   import { bindMagnetic } from './MagneticButton.js';
 *   bindMagnetic(document.querySelectorAll('[data-magnetic]'));
 */

import { gsap } from 'gsap';

const DEFAULT_OPTIONS = {
  radius: 90,       // px : zone d'attraction autour du centre
  strength: 0.35,   // 0..1 : intensité du déplacement
  innerMultiplier: 1.4, // le contenu interne se déplace plus que l'enveloppe
};

/**
 * Active l'effet magnétique sur une liste d'éléments.
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} elements
 * @param {Partial<typeof DEFAULT_OPTIONS>} options
 * @returns {() => void}  Fonction de cleanup
 */
export function bindMagnetic(_elements, _options = {}) {
  // Effet magnétique désactivé : jugé perturbant. Les boutons gardent
  // uniquement leurs états :hover / :active CSS. On garde la signature
  // pour ne pas casser les appels existants.
  return () => {};
}

/** @deprecated conservé pour référence, non utilisé */
function bindMagneticImpl(elements, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cleanups = [];

  elements.forEach((el) => {
    if (!el) return;
    const inner = el.querySelector('.btn__inner, .btn__label') || el.firstElementChild;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const effectiveRadius = opts.radius + rect.width / 2;

      if (dist > effectiveRadius) {
        reset();
        return;
      }

      const tx = dx * opts.strength;
      const ty = dy * opts.strength;
      gsap.to(el, { x: tx, y: ty, duration: 0.6, ease: 'power3.out' });
      if (inner) {
        gsap.to(inner, {
          x: tx * opts.innerMultiplier,
          y: ty * opts.innerMultiplier,
          duration: 0.6,
          ease: 'power3.out',
        });
      }
    };

    const reset = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      if (inner) {
        gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      }
    };

    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);

    cleanups.push(() => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      reset();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Easings.js — courbes d'interpolation portées de Flutter / Material Motion.
 *
 * Format dual : strings cubic-bezier compatibles GSAP/CSS, et fonctions
 * pures pour interpolation manuelle (lerp custom).
 */

/** Courbes utilisables comme strings dans GSAP ou CSS. */
export const Bezier = {
  outExpo:      'cubic-bezier(0.16, 1, 0.3, 1)',
  inOutQuart:   'cubic-bezier(0.76, 0, 0.24, 1)',
  spring:       'cubic-bezier(0.34, 1.56, 0.64, 1)',
  emphasized:   'cubic-bezier(0.2, 0, 0, 1)',
  decelerated:  'cubic-bezier(0, 0, 0.2, 1)',
};

/** Fonctions pures (t entre 0 et 1 → valeur entre 0 et 1). */
export const Ease = {
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  outBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
};

/**
 * Linear interpolation classique.
 * @param {number} a  Valeur de départ
 * @param {number} b  Valeur d'arrivée
 * @param {number} t  Coefficient [0..1] (peut dépasser pour lerp lisse)
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Damp : lerp framerate-independent, idéal pour suivre la souris.
 * @param {number} current  Valeur actuelle
 * @param {number} target   Valeur cible
 * @param {number} lambda   Vitesse d'approche (plus haut = plus rapide)
 * @param {number} dt       Delta time en secondes
 */
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

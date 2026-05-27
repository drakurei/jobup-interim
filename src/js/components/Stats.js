/**
 * Stats.js — bandeau de 4 KPIs (15 000 missions, 320+ clients, 48h, 4.9/5).
 * Compteur animé au reveal.
 */

import { gsap } from 'gsap';

const STATS = [
  { value: 15000, suffix: '+', label: 'missions par an', icon: '⚡' },
  { value: 320,   suffix: '+', label: 'clients actifs',  icon: '🏢' },
  { value: 48,    suffix: 'h', label: 'délai moyen',     icon: '⏱' },
];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountStats({ mount } = {}) {
  const target = mount || document.getElementById('stats-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    <div class="stats" data-reveal>
      ${STATS.map((s, i) => `
        <div class="stat">
          <div class="stat__icon">${s.icon}</div>
          <div class="stat__value" data-target="${s.value}" data-decimal="${s.decimal ? 1 : 0}">0</div>
          <div class="stat__suffix">${s.suffix}</div>
          <div class="stat__label">${s.label}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Compteur animé déclenché par IntersectionObserver
  const counters = target.querySelectorAll('.stat__value');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal, 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'expo.out',
      onUpdate: () => {
        el.textContent = decimal
          ? obj.v.toFixed(1).replace('.', ',')
          : Math.round(obj.v).toLocaleString('fr-FR');
      },
    });
  };

  // Déclenche l'animation à l'entrée dans le viewport. Fallback : si l'observer
  // ne se déclenche pas (capture statique, prefers-reduced-motion partiel), on
  // anime aussi après un court délai pour garantir un état lisible.
  const animated = new WeakSet();
  const animateOnce = (el) => {
    if (animated.has(el)) return;
    animated.add(el);
    animateCounter(el);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateOnce(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach((c) => obs.observe(c));

  // Fallback : si pas animé après 2s, force l'animation (utile en SSR / capture).
  const fallback = setTimeout(() => {
    counters.forEach(animateOnce);
  }, 2000);

  return () => {
    clearTimeout(fallback);
    obs.disconnect();
    target.innerHTML = '';
  };
}

/**
 * Values.js — section "Confiance · Accompagnement · Évolution" sur home.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const ITEMS = [
  {
    num: '01',
    title: 'Confiance',
    highlight: 'sans BS',
    desc: 'On dit ce qu\'on fait, on fait ce qu\'on dit. Tu sais à quoi t\'attendre, tu sais où tu vas. Zéro fausse promesse, zéro mission fantôme.',
    icon: 'shield',
  },
  {
    num: '02',
    title: 'Accompagnement',
    highlight: 'à 360°',
    desc: 'Un conseiller dédié, joignable. On t\'aide à préparer tes entretiens, à négocier ton TJM, à pivoter quand il le faut.',
    icon: 'support',
  },
  {
    num: '03',
    title: 'Évolution',
    highlight: 'réelle',
    desc: 'Chaque mission est pensée comme une marche. Skills à acquérir, salaire à faire grandir, réseau à étendre. On joue le long terme.',
    icon: 'arrow-up',
  },
];

const ICONS = {
  'shield':   '<svg viewBox="0 0 64 64" fill="none"><path d="M32 6 L54 16 V32 C54 46 32 58 32 58 C32 58 10 46 10 32 V16 Z" stroke="currentColor" stroke-width="2.5"/><path d="M22 30 L29 38 L42 24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  // Casque d'assistance : conseiller dédié, joignable.
  'support':  '<svg viewBox="0 0 64 64" fill="none"><path d="M14 40 V32 a18 18 0 0 1 36 0 V40" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="9" y="36" width="9" height="16" rx="4" stroke="currentColor" stroke-width="2.5"/><rect x="46" y="36" width="9" height="16" rx="4" stroke="currentColor" stroke-width="2.5"/><path d="M50.5 52 v2 a8 8 0 0 1 -8 8 H34" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  'arrow-up': '<svg viewBox="0 0 64 64" fill="none"><path d="M8 50 L24 32 L36 40 L56 14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 14 L56 14 L56 26" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountValues({ mount } = {}) {
  const target = mount || document.getElementById('values-mount');
  if (!target) return () => {};

  const cards = ITEMS.map((item) => /* html */ `
    <article class="value-card">
      <div class="value-card__icon" style="color: var(--brand-glow)">${ICONS[item.icon]}</div>
      <span class="value-card__num">${item.num} / 03</span>
      <h3 class="value-card__title">
        ${item.title}<br>
        <span class="value-card__title-highlight">${item.highlight}</span>
      </h3>
      <p class="value-card__desc">${item.desc}</p>
    </article>
  `).join('');

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Trois mots. Trois engagements.',
      title: 'Ce qui change <span class="text-gradient-blue">vraiment</span>.',
      subtitle: 'On a passé 10 ans à voir l\'intérim mal fait. On a décidé de le refaire à notre façon.',
    })}
    <div class="values" data-reveal>
      ${cards}
    </div>
  `;

  return () => { target.innerHTML = ''; };
}

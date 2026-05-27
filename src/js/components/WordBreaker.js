/**
 * WordBreaker.js — section plein écran avec un mot massif (style ORYZO).
 *
 * Affiche un seul mot (CONFIANCE / ACCOMPAGNEMENT / ÉVOLUTION) en typo display
 * géante avec eyebrow et baseline courte. Effet "respiration" entre les sections
 * denses, et reprend les 3 valeurs marque comme repères narratifs.
 */

const PRESETS = {
  confiance: {
    eyebrow: 'Pilier nº 01 — Confiance',
    word: 'Confiance',
    tagline: 'On dit ce qu\'on fait. On fait ce qu\'on dit. Pas de zone grise — jamais.',
  },
  accompagnement: {
    eyebrow: 'Pilier nº 02 — Accompagnement',
    word: 'Accompagner.',
    tagline: 'Un conseiller dédié, joignable. Avant, pendant, après la mission. Pas de bot.',
  },
  evolution: {
    eyebrow: 'Pilier nº 03 — Évolution',
    word: 'Évoluer.',
    tagline: 'Chaque mission est une marche. Skill, salaire, réseau — on pense long terme.',
  },
};

/**
 * @param {{ mount?: HTMLElement, preset?: 'confiance'|'accompagnement'|'evolution' }} options
 * @returns {() => void}
 */
export function mountWordBreaker({ mount, preset = 'confiance' } = {}) {
  const target = mount || document.querySelector(`[data-wordbreaker="${preset}"]`);
  if (!target) return () => {};
  const data = PRESETS[preset] || PRESETS.confiance;

  target.innerHTML = /* html */ `
    <div class="wordbreaker" data-reveal>
      <span class="wordbreaker__eyebrow">${data.eyebrow}</span>
      <h2 class="wordbreaker__word">${data.word}</h2>
      <p class="wordbreaker__tagline">${data.tagline}</p>
      <span class="wordbreaker__scroll" aria-hidden="true">
        ↓ scroll to continue
      </span>
    </div>
  `;

  return () => { target.innerHTML = ''; };
}

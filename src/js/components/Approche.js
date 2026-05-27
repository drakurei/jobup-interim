/**
 * Approche.js — bande éditoriale pleine largeur avec photographie cinématique.
 * Geste signature premium (réf NovaBanque) : grande image + déclaration courte.
 */

const IMG = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1700&q=80';

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountApproche({ mount } = {}) {
  const target = mount || document.getElementById('approche-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    <div class="approche" data-reveal>
      <img class="approche__bg" src="${IMG}" alt="Équipe JOB UP en réunion"
           data-parallax="0.06" loading="lazy" width="1700" height="900">
      <div class="approche__veil"></div>
      <div class="approche__content">
        <span class="approche__eyebrow">Notre approche</span>
        <h2 class="approche__title">On a remis l'humain au centre de l'intérim.</h2>
        <p class="approche__text">
          Pas d'algorithme qui décide à votre place, pas de standard qui ne
          répond jamais. Un conseiller qui connaît votre métier, vos chantiers,
          vos contraintes. Et qui décroche quand vous appelez.
        </p>
        <div class="approche__stats">
          <div><strong>10 ans</strong><span>sur le terrain</span></div>
          <div><strong>1 conseiller</strong><span>dédié par profil</span></div>
          <div><strong>48h</strong><span>pour vous répondre</span></div>
        </div>
      </div>
    </div>
  `;
  return () => { target.innerHTML = ''; };
}

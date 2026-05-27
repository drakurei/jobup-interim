/**
 * Process.js — 4 étapes numérotées du parcours candidat.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const STEPS = [
  {
    n: '01',
    title: 'Brief',
    desc: 'On échange 20 minutes pour comprendre ton métier, ta situation, ce que tu veux vraiment. Pas de formulaire, pas de filtre RH.',
    time: 'Jour 0',
  },
  {
    n: '02',
    title: 'Recherche',
    desc: 'On scanne nos 320 clients actifs et on déclenche notre réseau. On ne vous bombarde pas : 3 missions max, qui matchent vraiment.',
    time: 'Jour 1 à 3',
  },
  {
    n: '03',
    title: 'Sélection',
    desc: 'Tu choisis. On organise les entretiens, on prépare avec toi, on négocie ton TJM. Tu signes quand tu es sûr·e.',
    time: 'Jour 3 à 7',
  },
  {
    n: '04',
    title: 'Suivi',
    desc: 'Pendant la mission, on reste joignable. Conflit, retard de paiement, prolongation : on traite. Et on prépare la suivante.',
    time: 'Toute la mission',
  },
];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountProcess({ mount } = {}) {
  const target = mount || document.getElementById('process-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Notre méthode',
      title: 'Quatre étapes. <span class="text-gradient-blue">Zéro</span> bullshit.',
      subtitle: 'Un process aussi clair pour toi que pour nous. Tu sais toujours où tu en es, ce qui suit, et combien de temps ça prendra.',
    })}
    <ol class="process" data-reveal>
      ${STEPS.map((s) => `
        <li class="process-step">
          <div class="process-step__num">${s.n}</div>
          <div class="process-step__body">
            <h3 class="process-step__title">${s.title}</h3>
            <p class="process-step__desc">${s.desc}</p>
            <span class="process-step__time">${s.time}</span>
          </div>
        </li>
      `).join('')}
    </ol>
  `;

  return () => { target.innerHTML = ''; };
}

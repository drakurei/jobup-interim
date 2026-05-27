/**
 * Faq.js — section FAQ accordéon.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const ITEMS = [
  { q: "L'inscription est-elle gratuite pour les candidats ?",
    a: "Oui, 100% gratuite. On ne facture jamais les talents : ni inscription, ni commission, ni frais cachés. Notre rémunération vient des entreprises." },
  { q: "Sous combien de temps suis-je recontacté(e) ?",
    a: "Sous 24h ouvrées après réception de votre candidature. Même si la réponse est négative, on vous le dit : c'est notre engagement." },
  { q: "Quels secteurs couvrez-vous ?",
    a: "BTP (gros œuvre, second œuvre, TP), tertiaire (compta, RH, ADV, accueil) et logistique (cariste, préparation de commandes). Partout en France." },
  { q: "Proposez-vous des missions qui débouchent sur un CDI ?",
    a: "Beaucoup de nos missions d'intérim sont des pré-embauches. On t'indique clairement les missions avec perspective d'embauche dès le brief." },
  { q: "Comment fonctionne l'accompagnement ?",
    a: "Un conseiller dédié, joignable directement. Il t'aide à préparer tes entretiens, négocier ta rémunération, et reste disponible pendant toute la mission." },
];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountFaq({ mount } = {}) {
  const target = mount || document.getElementById('faq-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Questions fréquentes',
      title: 'Tout ce que tu te <span class="hero__accent">demandes</span>.',
      subtitle: "Et si vous ne trouvez pas votre réponse, écrivez-nous. On répond vite et clairement.",
    })}
    <div class="faq" data-reveal data-reveal-stagger="0.06">
      ${ITEMS.map((it, i) => `
        <details class="faq__item"${i === 0 ? ' open' : ''}>
          <summary class="faq__q">${it.q}<span class="faq__icon" aria-hidden="true">+</span></summary>
          <p class="faq__a">${it.a}</p>
        </details>
      `).join('')}
    </div>
  `;
  return () => { target.innerHTML = ''; };
}

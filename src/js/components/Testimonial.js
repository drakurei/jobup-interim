/**
 * Testimonial.js — section avis clients, plusieurs témoignages alignés en grille.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const REVIEWS = [
  {
    quote: 'En trois ans avec JOB UP, 47 missions placées sur nos chantiers du Grand Paris. Aucun délai dépassé, aucun conflit géré seul.',
    name: 'Pierre Durand',
    role: 'Directeur travaux · Bâtir & Co',
    initials: 'PD',
  },
  {
    quote: 'On parle à des humains, pas à un commercial qui lit un script. Mon conseiller connaît mon métier mieux que moi certains jours.',
    name: 'Sofia Renard',
    role: 'Cariste · en mission chez LogiDis',
    initials: 'SR',
  },
  {
    quote: 'Trois CDD, puis un CDI. À chaque étape on m\'a aidée à négocier et à viser plus haut. C\'est rare dans l\'intérim.',
    name: 'Aïcha Benali',
    role: 'Gestionnaire paie · ex-intérimaire',
    initials: 'AB',
  },
];

const STAR = '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>';

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountTestimonial({ mount } = {}) {
  const target = mount || document.getElementById('testimonial-mount');
  if (!target) return () => {};

  const cards = REVIEWS.map((r) => /* html */ `
    <figure class="review">
      <div class="review__stars" aria-label="Note 5 sur 5">${STAR.repeat(5)}</div>
      <blockquote class="review__quote">${r.quote}</blockquote>
      <figcaption class="review__author">
        <span class="review__avatar" aria-hidden="true">${r.initials}</span>
        <span class="review__meta">
          <strong>${r.name}</strong>
          <span>${r.role}</span>
        </span>
      </figcaption>
    </figure>
  `).join('');

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Ils en parlent mieux que nous',
      title: 'La confiance, ça se mérite.',
      subtitle: 'Côté entreprises comme côté talents, on construit des relations qui durent.',
    })}
    <div class="reviews" data-reveal data-reveal-stagger="0.1">${cards}</div>
  `;
  return () => { target.innerHTML = ''; };
}

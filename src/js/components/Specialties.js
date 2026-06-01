/**
 * Specialties.js — secteurs couverts, en cartes éditoriales avec photographie.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const ITEMS = [
  {
    key: 'btp',
    title: 'BTP',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    alt: 'Ouvrier sur un chantier de construction',
    desc: 'Gros œuvre, second œuvre, travaux publics, conduite d\'engins. Du compagnon au chef de chantier.',
    tags: ['Maçon', 'Coffreur', 'Chef de chantier', 'Conducteur d\'engins', 'Électricien', 'Plombier'],
  },
  {
    key: 'tertiaire',
    title: 'Tertiaire',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    alt: 'Espace de bureau lumineux',
    desc: 'Du back-office à la relation client. Comptabilité, RH, ADV, accueil, support.',
    tags: ['Comptable', 'Gestionnaire paie', 'Assistant ADV', 'Chargé RH', 'Accueil'],
  },
  {
    key: 'logistique',
    title: 'Logistique',
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    alt: 'Entrepôt logistique',
    desc: 'Entrepôt, préparation, conduite de chariots. Des profils disponibles vite, en équipe.',
    tags: ['Cariste CACES', 'Préparateur', 'Magasinier', 'Agent de quai'],
  },
];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountSpecialties({ mount } = {}) {
  const target = mount || document.getElementById('specialties-mount');
  if (!target) return () => {};

  const cards = ITEMS.map((it) => /* html */ `
    <a class="specialty-card" href="jobs.html?cat=${it.key}">
      <div class="specialty-card__media">
        <img src="${it.img}" alt="${it.alt}" loading="lazy" width="800" height="600">
      </div>
      <div class="specialty-card__body">
        <h3 class="specialty-card__title">${it.title}</h3>
        <p class="specialty-card__desc">${it.desc}</p>
        <ul class="specialty-card__tags">
          ${it.tags.map((t) => `<li>${t}</li>`).join('')}
        </ul>
        <span class="specialty-card__cta">Voir les offres ${it.title} →</span>
      </div>
    </a>
  `).join('');

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Secteurs',
      title: 'Trois métiers, un même niveau d\'exigence.',
      subtitle: 'Du chantier au siège, du junior au senior. On recrute là où les autres ne vont pas, ou mal.',
    })}
    <div class="specialties" data-reveal>${cards}</div>
  `;
  return () => { target.innerHTML = ''; };
}

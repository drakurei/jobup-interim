/**
 * FeaturedJobs.js — section "Offres mises en avant" sur la page home.
 * Charge jobs.json, filtre featured=true, monte 3 cartes avec tilt.
 */

import { jobCardHTML } from './JobCard.js';
import { bindTilt } from '../animations/TiltEffect.js';
import { sectionHeadingHTML } from './SectionHeading.js';

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {Promise<() => void>}
 */
export async function mountFeaturedJobs({ mount } = {}) {
  const target = mount || document.getElementById('featured-jobs-mount');
  if (!target) return () => {};

  // Skeleton pendant le chargement
  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Sélection éditoriale',
      title: 'Les missions <span class="text-gradient-blue">du moment</span>.',
      subtitle: 'Des opportunités triées sur le volet. Pas de copier-coller LinkedIn, pas de fausses annonces. Juste des missions actives avec des équipes qu\'on connaît.',
    })}
    <div class="featured-jobs__row">
      <span></span>
      <a class="btn btn--ghost btn--sm" href="/jobs.html" data-magnetic>
        <span class="btn__inner"><span class="btn__label">Toutes les offres</span> <span class="btn__arrow">→</span></span>
      </a>
    </div>
    <div class="featured-jobs__grid" data-reveal data-reveal-stagger="0.1">
      ${Array.from({ length: 3 }).map(() =>
        '<div class="skeleton" style="min-height: 280px; border-radius: 1.25rem;"></div>'
      ).join('')}
    </div>
  `;

  let unbindTilt = () => {};
  try {
    const res = await fetch('/data/jobs.json');
    const data = await res.json();
    const featured = (data.jobs || []).filter((j) => j.featured).slice(0, 3);
    const grid = target.querySelector('.featured-jobs__grid');
    grid.innerHTML = featured.map(jobCardHTML).join('');

    if (window.matchMedia('(min-width: 768px)').matches) {
      unbindTilt = bindTilt(grid.querySelectorAll('[data-tilt]'), { maxTilt: 6, scale: 1.015 });
    }
  } catch (err) {
    console.error('FeaturedJobs load failed', err);
    target.querySelector('.featured-jobs__grid').innerHTML =
      '<p class="jobs-grid__empty">Impossible de charger les offres. Réessaie plus tard.</p>';
  }

  return () => { unbindTilt(); target.innerHTML = ''; };
}

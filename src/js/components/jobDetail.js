/**
 * jobDetail.js — panneau de détail d'une offre (colonne droite du job-board).
 */

import { postedLabel } from './jobsFilters.js';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const BOOKMARK = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const PIN = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>';

function initials(name) {
  return (name || '').split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}
function list(items) {
  return `<ul class="jd__list">${(items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

/**
 * @param {object} job
 * @returns {string} HTML
 */
export function jobDetailHTML(job) {
  if (!job) {
    return '<div class="jd jd--empty"><p>Sélectionne une offre pour voir le détail.</p></div>';
  }
  const missions = (job.missions || []).map((m) => `<p>${esc(m)}</p>`).join('');
  const cat = (job.category || '').toLowerCase();

  return /* html */ `
    <article class="jd">
      <button class="jd__back" type="button" aria-label="Retour à la liste des offres">← Toutes les offres</button>
      <div class="jd__top">
        <span class="job-card__category job-card__category--${esc(cat)}">${esc(job.category)}</span>
        ${job.isNew ? '<span class="jd__new">Nouveau</span>' : ''}
      </div>

      <h2 class="jd__title">${esc(job.title)}</h2>

      <div class="jd__company">
        <span class="jd__avatar" aria-hidden="true">${esc(initials(job.company))}</span>
        <span class="jd__company-meta">
          <strong>${esc(job.company)}</strong>
          <span>${PIN} ${esc(job.location)} · ${esc(postedLabel(job.postedAt))}</span>
        </span>
      </div>

      <div class="jd__actions">
        <a class="btn btn--primary jd__apply" href="apply.html?job=${esc(job.id)}">
          <span class="btn__inner"><span class="btn__label">Postuler</span><span class="btn__arrow">→</span></span>
        </a>
        <button class="jd__save" aria-label="Enregistrer l'offre">${BOOKMARK}</button>
      </div>

      <div class="jd__summary">
        <div><span class="jd__summary-label">Contrat</span><span class="jd__summary-val">${esc(job.contract)}</span></div>
        <div><span class="jd__summary-label">Durée</span><span class="jd__summary-val">${esc(job.duration)}</span></div>
        <div><span class="jd__summary-label">Rémunération</span><span class="jd__summary-val">${esc(job.salary)}</span></div>
      </div>

      <section class="jd__section">
        <h3>À propos de la mission</h3>
        <p>${esc(job.description)}</p>
      </section>
      <section class="jd__section">
        <h3>Vos missions</h3>
        ${missions}
      </section>
      <section class="jd__section">
        <h3>Profil recherché</h3>
        ${list(job.profile)}
      </section>
      <section class="jd__section">
        <h3>Ce que nous offrons</h3>
        ${list(job.perks)}
      </section>
    </article>
  `;
}

/**
 * jobCardList.js — carte compacte de la liste (colonne du milieu du job-board).
 */

import { postedLabel } from './jobsFilters.js';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const PIN = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>';
const DOC = '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const EUR = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M15 9a4 4 0 100 6M8 11h5M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const BOOKMARK = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

/**
 * @param {object} job
 * @param {boolean} active
 * @returns {string} HTML
 */
export function jobListCardHTML(job, active = false) {
  const tags = (job.skills || []).slice(0, 3)
    .map((s) => `<span class="jb-card__tag">${esc(s)}</span>`).join('');
  return /* html */ `
    <article class="jb-card${active ? ' is-active' : ''}" data-id="${esc(job.id)}" tabindex="0" role="button">
      <button class="jb-card__bookmark" aria-label="Enregistrer">${BOOKMARK}</button>
      <h3 class="jb-card__title">${esc(job.title)}</h3>
      <p class="jb-card__company">${esc(job.company)}</p>
      <div class="jb-card__meta">
        <span>${PIN} ${esc(job.location)}</span>
        <span>${DOC} ${esc(job.contract)} · ${esc(job.duration)}</span>
        <span>${EUR} ${esc(job.salary)}</span>
      </div>
      <div class="jb-card__tags">${tags}</div>
      <p class="jb-card__excerpt">${esc(job.description)}</p>
      <div class="jb-card__foot">
        <span class="jb-card__date">${postedLabel(job.postedAt)}</span>
        ${job.isNew ? '<span class="jb-card__new">● Nouveau</span>' : ''}
      </div>
    </article>
  `;
}

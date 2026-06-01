/**
 * JobCard.js — carte d'offre d'emploi (réutilisée sur home featured + page jobs).
 */

/**
 * Échappe un texte HTML basique.
 * @param {string} s
 */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * @param {object} job   Objet job depuis jobs.json
 * @returns {string} HTML
 */
export function jobCardHTML(job) {
  const skills = (job.skills || []).slice(0, 4).map((s) =>
    `<span class="job-card__skill">${esc(s)}</span>`).join('');
  const catClass = `job-card__category--${(job.category || '').toLowerCase()}`;
  const featuredClass = job.featured ? ' job-card--featured' : '';

  return /* html */ `
    <a class="job-card${featuredClass}" href="apply.html?job=${esc(job.id)}"
       data-tilt data-job-id="${esc(job.id)}">
      <header class="job-card__header">
        <span class="job-card__category ${catClass}">${esc(job.category)}</span>
        <span class="job-card__id">${esc(job.id)}</span>
      </header>
      <div>
        <h3 class="job-card__title">${esc(job.title)}</h3>
        <ul class="job-card__meta">
          <li class="job-card__meta-item">📍 ${esc(job.location)}</li>
          <li class="job-card__meta-item">⏱ ${esc(job.contract)} · ${esc(job.duration)}</li>
          <li class="job-card__meta-item">🌐 ${esc(job.remote)}</li>
        </ul>
      </div>
      <div class="job-card__skills">${skills}</div>
      <div class="job-card__footer">
        <span class="job-card__salary">${esc(job.salary)}</span>
        <span class="job-card__cta">Postuler →</span>
      </div>
    </a>
  `;
}

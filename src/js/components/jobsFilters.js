/**
 * jobsFilters.js — helpers purs : parsing salaire, filtrage, tri, compteurs.
 */

const HOURS_PER_MONTH = 151.67;

/**
 * Salaire mensuel min estimé depuis la chaîne ("13,50 €/h", "42 – 48 K€", "2 600 €/mois").
 * @param {string} salary
 * @returns {number}
 */
export function parseMonthlyMin(salary) {
  if (!salary) return 0;
  const s = salary.toLowerCase();
  // premier nombre (gère "13,50" et "2 600" et "42")
  const m = s.replace(/ /g, ' ').match(/(\d[\d\s]*)(?:[.,](\d+))?/);
  if (!m) return 0;
  let n = parseFloat((m[1].replace(/\s/g, '')) + (m[2] ? '.' + m[2] : ''));
  if (s.includes('/h')) return Math.round(n * HOURS_PER_MONTH);
  if (s.includes('k')) return Math.round((n * 1000) / 12);
  return Math.round(n); // €/mois
}

/**
 * @param {string} iso @param {Date} now @returns {number} jours écoulés
 */
export function daysSince(iso, now = new Date()) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return Infinity;
  return Math.floor((now - d) / 86400000);
}

/** Libellé "Publié il y a …" */
export function postedLabel(iso, now = new Date()) {
  const days = daysSince(iso, now);
  if (days <= 0) return "Publié aujourd'hui";
  if (days === 1) return 'Publié il y a 1j';
  if (days < 7) return `Publié il y a ${days}j`;
  if (days < 14) return 'Publié il y a 1 sem.';
  return `Publié il y a ${Math.floor(days / 7)} sem.`;
}

/**
 * @param {object[]} jobs
 * @param {{ query: string, contracts: Set<string>, sectors: Set<string>, published: string, salaryMin: number }} f
 * @param {Date} now
 */
export function filterJobs(jobs, f, now = new Date()) {
  const q = (f.query || '').trim().toLowerCase();
  const pubLimit = { '24h': 1, '3j': 3, '7j': 7, all: Infinity }[f.published] ?? Infinity;
  return jobs.filter((j) => {
    if (q) {
      const hay = `${j.title} ${j.company} ${j.category} ${(j.skills || []).join(' ')} ${j.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.contracts.size && !f.contracts.has(j.contract)) return false;
    if (f.sectors.size && !f.sectors.has(j.category)) return false;
    if (daysSince(j.postedAt, now) > pubLimit) return false;
    if (f.salaryMin > 0 && parseMonthlyMin(j.salary) < f.salaryMin) return false;
    return true;
  });
}

/** @param {object[]} jobs @param {string} sort */
export function sortJobs(jobs, sort) {
  const list = [...jobs];
  if (sort === 'date') list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  else if (sort === 'salaire') list.sort((a, b) => parseMonthlyMin(b.salary) - parseMonthlyMin(a.salary));
  else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || new Date(b.postedAt) - new Date(a.postedAt));
  return list;
}

/** Compteurs par valeur pour une clé donnée. @returns {Record<string, number>} */
export function countBy(jobs, key) {
  return jobs.reduce((acc, j) => {
    acc[j[key]] = (acc[j[key]] || 0) + 1;
    return acc;
  }, {});
}

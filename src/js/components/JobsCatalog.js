/**
 * JobsCatalog.js — job-board master-détail (réf screenshot client).
 * Recherche multi-champs + filtres à compteurs + liste sélectionnable + détail.
 */

import { jobListCardHTML } from './jobCardList.js';
import { jobDetailHTML } from './jobDetail.js';
import { buildJobsShellHTML } from './jobsShell.js';
import { filterJobs, sortJobs, countBy } from './jobsFilters.js';

const SUGGESTIONS = ['Maçon', 'Électricien', 'Cariste', 'Comptable', 'Chef de chantier', 'Grutier', 'Plombier'];

const state = {
  jobs: [], query: '', location: '',
  fContracts: new Set(), fSectors: new Set(),
  published: 'all', salaryMin: 0, sort: 'pertinence',
  selectedId: null,
};

function currentList() {
  let list = filterJobs(state.jobs, {
    query: `${state.query} ${state.location}`.trim(),
    contracts: state.fContracts, sectors: state.fSectors,
    published: state.published, salaryMin: state.salaryMin,
  });
  return sortJobs(list, state.sort);
}

function renderList(root) {
  const list = currentList();
  const listEl = root.querySelector('#jb-list');
  const countEl = root.querySelector('#jb-count');
  countEl.innerHTML = `<strong>${list.length}</strong> offre${list.length > 1 ? 's' : ''} trouvée${list.length > 1 ? 's' : ''}`;

  if (!list.length) {
    listEl.innerHTML = '<p class="jb-empty">Aucune offre ne correspond. Élargis tes filtres.</p>';
    state.selectedId = null;
    root.querySelector('#jb-detail').innerHTML = jobDetailHTML(null);
    return;
  }
  if (!list.find((j) => j.id === state.selectedId)) state.selectedId = list[0].id;
  listEl.innerHTML = list.map((j) => jobListCardHTML(j, j.id === state.selectedId)).join('');
  renderDetail(root);
}

function renderDetail(root) {
  const job = state.jobs.find((j) => j.id === state.selectedId);
  root.querySelector('#jb-detail').innerHTML = jobDetailHTML(job);
}

function wire(root) {
  const refresh = () => renderList(root);

  root.querySelector('#jb-q').addEventListener('input', (e) => { state.query = e.target.value; refresh(); });
  root.querySelector('#jb-loc').addEventListener('input', (e) => { state.location = e.target.value; refresh(); });
  root.querySelector('#jb-type').addEventListener('change', (e) => {
    state.fContracts = e.target.value ? new Set([e.target.value]) : new Set();
    root.querySelectorAll('[data-filter="contract"]').forEach((c) => (c.checked = state.fContracts.has(c.value)));
    refresh();
  });
  root.querySelector('#jb-search').addEventListener('click', refresh);

  root.querySelectorAll('.jb-pill').forEach((b) => b.addEventListener('click', () => {
    state.query = b.dataset.q; root.querySelector('#jb-q').value = b.dataset.q; refresh();
  }));

  root.querySelectorAll('[data-filter]').forEach((input) => input.addEventListener('change', () => {
    const set = input.dataset.filter === 'contract' ? state.fContracts : state.fSectors;
    input.checked ? set.add(input.value) : set.delete(input.value);
    refresh();
  }));

  root.querySelectorAll('[name="jb-pub"]').forEach((r) => r.addEventListener('change', () => {
    state.published = r.value; refresh();
  }));

  const sal = root.querySelector('#jb-salary');
  sal.addEventListener('input', () => {
    state.salaryMin = parseInt(sal.value, 10);
    root.querySelector('#jb-salary-val').textContent = state.salaryMin
      ? `${state.salaryMin.toLocaleString('fr-FR')} €` : 'Indifférent';
    refresh();
  });

  root.querySelector('#jb-sort').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });

  root.querySelector('#jb-reset').addEventListener('click', () => {
    Object.assign(state, { query: '', location: '', published: 'all', salaryMin: 0, sort: 'pertinence' });
    state.fContracts.clear(); state.fSectors.clear();
    root.querySelector('#jb-q').value = ''; root.querySelector('#jb-loc').value = '';
    root.querySelector('#jb-type').value = '';
    root.querySelectorAll('[data-filter]').forEach((i) => (i.checked = false));
    root.querySelector('[name="jb-pub"][value="all"]').checked = true;
    sal.value = 0; root.querySelector('#jb-salary-val').textContent = 'Indifférent';
    root.querySelector('#jb-sort').value = 'pertinence';
    refresh();
  });

  // Sélection d'une carte → détail
  root.querySelector('#jb-list').addEventListener('click', (e) => {
    if (e.target.closest('.jb-card__bookmark')) { e.stopPropagation(); return; }
    const card = e.target.closest('.jb-card');
    if (!card) return;
    state.selectedId = card.dataset.id;
    root.querySelectorAll('.jb-card').forEach((c) => c.classList.toggle('is-active', c.dataset.id === state.selectedId));
    renderDetail(root);
  });
}

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {Promise<() => void>}
 */
export async function mountJobsCatalog({ mount } = {}) {
  const root = mount || document.getElementById('jobs-mount');
  if (!root) return () => {};
  try {
    const data = await (await fetch(`${import.meta.env.BASE_URL}data/jobs.json`)).json();
    state.jobs = data.jobs || [];
    root.innerHTML = buildJobsShellHTML({
      suggestions: SUGGESTIONS,
      sectors: data.categories || [],
      contracts: data.contracts || [],
      contractCounts: countBy(state.jobs, 'contract'),
      sectorCounts: countBy(state.jobs, 'category'),
    });
  } catch {
    root.innerHTML = '<p class="jb-empty">Erreur de chargement des offres.</p>';
    return () => {};
  }

  // Pré-filtre ?cat=
  const cat = new URLSearchParams(location.search).get('cat');
  if (cat) {
    const match = (state.jobs.map((j) => j.category)).find((c) => c.toLowerCase() === cat.toLowerCase());
    if (match) {
      state.fSectors.add(match);
      const cb = root.querySelector(`[data-filter="sector"][value="${match}"]`);
      if (cb) cb.checked = true;
    }
  }

  wire(root);
  renderList(root);
  return () => { root.innerHTML = ''; };
}

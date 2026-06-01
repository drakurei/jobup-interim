/**
 * AdminOffers.js — page d'admin (sans backend) pour gérer les offres.
 *
 * Charge le jobs.json actuel, permet d'ajouter / modifier / supprimer des
 * offres en mémoire, puis d'exporter le fichier jobs.json à jour (téléchargement
 * ou copie). L'utilisateur dépose ensuite le fichier sur GitHub : le site se
 * reconstruit automatiquement. Aucune donnée n'est envoyée nulle part.
 */

import { adminShellHTML, offerRowsHTML } from './adminTemplate.js';

const TEXT_FIELDS = ['title', 'company', 'location', 'duration', 'salary'];
const LIST_FIELDS = ['skills', 'missions', 'profile', 'perks'];
const REQUIRED = ['title', 'company', 'location', 'description'];
const DEFAULTS = { categories: ['BTP', 'Tertiaire', 'Logistique'], contracts: ['Intérim', 'CDD', 'CDI'] };

const state = { data: { jobs: [], ...DEFAULTS }, editing: -1 };

const lines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);
const g = (root, id) => root.querySelector(`#adm-${id}`);

function nextId(jobs) {
  const max = jobs.reduce((m, j) => {
    const n = parseInt(String(j.id).replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `j-${String(max + 1).padStart(3, '0')}`;
}

function readForm(root) {
  const job = {};
  TEXT_FIELDS.forEach((f) => { job[f] = g(root, f).value.trim(); });
  job.category = g(root, 'category').value;
  job.contract = g(root, 'contract').value;
  job.postedAt = g(root, 'postedAt').value;
  job.isNew = g(root, 'isNew').checked;
  job.description = g(root, 'description').value.trim();
  LIST_FIELDS.forEach((f) => { job[f] = lines(g(root, f).value); });
  return job;
}

function fillForm(root, j) {
  TEXT_FIELDS.forEach((f) => { g(root, f).value = j[f] || ''; });
  g(root, 'category').value = j.category || state.data.categories[0];
  g(root, 'contract').value = j.contract || state.data.contracts[0];
  g(root, 'postedAt').value = j.postedAt || new Date().toISOString().slice(0, 10);
  g(root, 'isNew').checked = !!j.isNew;
  g(root, 'description').value = j.description || '';
  LIST_FIELDS.forEach((f) => { g(root, f).value = (j[f] || []).join('\n'); });
}

function setSaveLabel(root) {
  const label = root.querySelector('#adm-save .btn__label');
  if (label) label.textContent = state.editing >= 0 ? 'Mettre à jour l\'offre' : 'Ajouter l\'offre';
}

function clearForm(root) {
  root.querySelector('#adm-form').reset();
  state.editing = -1;
  setSaveLabel(root);
}

function renderList(root) {
  root.querySelector('#adm-list').innerHTML = offerRowsHTML(state.data.jobs);
  root.querySelector('#adm-count').textContent = state.data.jobs.length;
  root.querySelector('#adm-output').value = JSON.stringify(state.data, null, 2);
}

function markErrors(root, job) {
  let ok = true;
  REQUIRED.forEach((f) => {
    const wrap = g(root, f).closest('.form-field');
    const bad = !job[f];
    wrap.dataset.error = bad ? 'true' : 'false';
    if (bad) ok = false;
  });
  return ok;
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function wire(root) {
  root.querySelector('#adm-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const job = readForm(root);
    if (!markErrors(root, job)) return;
    if (state.editing >= 0) {
      job.id = state.data.jobs[state.editing].id;
      state.data.jobs[state.editing] = job;
    } else {
      job.id = nextId(state.data.jobs);
      state.data.jobs.unshift(job);
    }
    clearForm(root);
    renderList(root);
    root.querySelector('.adm__head').scrollIntoView({ behavior: 'smooth' });
  });

  root.querySelector('#adm-clear').addEventListener('click', () => clearForm(root));

  root.querySelector('#adm-list').addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    if (edit) {
      state.editing = parseInt(edit.dataset.edit, 10);
      fillForm(root, state.data.jobs[state.editing]);
      setSaveLabel(root);
      g(root, 'title').focus();
      g(root, 'title').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (del) {
      const i = parseInt(del.dataset.del, 10);
      const j = state.data.jobs[i];
      if (window.confirm(`Supprimer l'offre « ${j.title} » ?`)) {
        state.data.jobs.splice(i, 1);
        if (state.editing === i) clearForm(root);
        renderList(root);
      }
    }
  });

  root.querySelector('#adm-download').addEventListener('click', () => {
    download('jobs.json', JSON.stringify(state.data, null, 2));
  });

  root.querySelector('#adm-copy').addEventListener('click', async (e) => {
    const label = e.target.closest('button').querySelector('.btn__label');
    try {
      await navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
      const prev = label.textContent;
      label.textContent = 'Copié ✓';
      setTimeout(() => { label.textContent = prev; }, 1500);
    } catch { /* presse-papier indisponible */ }
  });
}

/**
 * Monte la page d'admin.
 * @param {{ mount?: HTMLElement }} options
 * @returns {Promise<() => void>}
 */
export async function mountAdmin({ mount } = {}) {
  const root = mount || document.getElementById('admin-mount');
  if (!root) return () => {};
  try {
    const data = await (await fetch(`${import.meta.env.BASE_URL}data/jobs.json`)).json();
    state.data = { jobs: data.jobs || [], categories: data.categories || DEFAULTS.categories, contracts: data.contracts || DEFAULTS.contracts };
  } catch {
    state.data = { jobs: [], ...DEFAULTS };
  }
  root.innerHTML = adminShellHTML({ categories: state.data.categories, contracts: state.data.contracts });
  wire(root);
  renderList(root);
  return () => { root.innerHTML = ''; };
}

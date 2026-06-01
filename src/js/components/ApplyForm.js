/**
 * ApplyForm.js — formulaire de candidature premium (upload CV + particules au focus).
 * Aucun backend : confirmation visuelle à la soumission. Pré-remplit la mission
 * visée si ?job=XXX est présent dans l'URL.
 */

import { gsap } from 'gsap';
import { sectionHeadingHTML } from './SectionHeading.js';

const FIELDS = [
  { name: 'firstName', label: 'Prénom',         type: 'text',  required: true,  half: true },
  { name: 'lastName',  label: 'Nom',            type: 'text',  required: true,  half: true },
  { name: 'email',     label: 'Email',          type: 'email', required: true,  half: true },
  { name: 'phone',     label: 'Téléphone',      type: 'tel',   required: false, half: true },
  { name: 'job',       label: 'Mission ou métier visé', type: 'text', required: true, half: false },
  { name: 'city',      label: 'Ville',          type: 'text',  required: true,  half: true },
  { name: 'avail',     label: 'Disponibilité',  type: 'select', required: true, half: true,
    options: ['Immédiate', 'Sous 1 mois', 'À convenir'] },
  { name: 'cv',        label: 'Votre CV (PDF, DOC)', type: 'file', required: false, half: false },
  { name: 'message',   label: 'Votre message en quelques lignes', type: 'textarea', required: false, half: false },
];

const ICON_UPLOAD = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

const ASIDE = [
  { icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    h: 'Un process clair', p: 'Vous envoyez, on lit, on vous appelle sous 24h, on vous briefe sur les missions qui matchent. Vous décidez.' },
  { icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.2 6.3L20.5 11l-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-1.7z" fill="currentColor"/></svg>',
    h: 'Conseil RH gratuit', p: 'Refonte CV, préparation d\'entretien, simulation de salaire : inclus. On ne facture jamais les talents.' },
  { icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    h: 'Confidentialité', p: 'Vos informations restent chez nous. Pas de revente, pas de partage sans votre accord explicite.' },
];

function fieldHTML(f) {
  let input;
  if (f.type === 'textarea') {
    input = `<textarea class="glass-field" id="apply-${f.name}" name="${f.name}" ${f.required ? 'required' : ''}></textarea>`;
  } else if (f.type === 'select') {
    input = `<select class="glass-field" id="apply-${f.name}" name="${f.name}" required>
        <option value="">Choisir…</option>${f.options.map((o) => `<option>${o}</option>`).join('')}</select>`;
  } else if (f.type === 'file') {
    return `<div class="form-field form-field--full">
        <label class="form-label" for="apply-${f.name}">${f.label}</label>
        <label class="cv-drop" for="apply-${f.name}">
          <span class="cv-drop__icon">${ICON_UPLOAD}</span>
          <span class="cv-drop__text" id="cv-text">Glissez votre CV ici ou cliquez pour parcourir</span>
          <input type="file" id="apply-${f.name}" name="${f.name}" accept=".pdf,.doc,.docx" hidden>
        </label>
      </div>`;
  } else {
    input = `<input class="glass-field" id="apply-${f.name}" name="${f.name}" type="${f.type}" ${f.required ? 'required' : ''}>`;
  }
  return `<div class="form-field${f.half ? '' : ' form-field--full'}" data-error="false">
      <label class="form-label" for="apply-${f.name}">${f.label}${f.required ? ' *' : ''}</label>
      ${input}<span class="form-error">Ce champ est requis.</span>
    </div>`;
}

function emitParticles(host, x, y) {
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('span');
    p.className = 'focus-particle';
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:var(--brand-blue);pointer-events:none;z-index:5;box-shadow:0 0 10px var(--brand-glow);`;
    host.appendChild(p);
    const ang = (Math.PI * 2 * i) / 5 - Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    gsap.to(p, { x: Math.cos(ang) * 60, y: Math.sin(ang) * 60, opacity: 0, scale: 0.4, duration: 0.8, ease: 'expo.out', onComplete: () => p.remove() });
  }
}

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountApplyForm({ mount } = {}) {
  const target = mount || document.getElementById('apply-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'Candidature en 2 minutes',
      title: 'Déposez votre profil.',
      subtitle: 'On lit chaque candidature. On revient vers vous sous 24h, même si c\'est pour dire non. C\'est notre engagement.',
    })}
    <div class="apply">
      <div class="apply__form-card" data-reveal>
        <form class="form-grid" id="apply-form" novalidate>
          ${FIELDS.map(fieldHTML).join('')}
          <div class="form-field form-field--full">
            <button class="btn btn--primary btn--lg" type="submit">
              <span class="btn__inner"><span class="btn__label">Envoyer ma candidature</span><span class="btn__arrow">→</span></span>
            </button>
          </div>
        </form>
      </div>
      <aside class="apply__aside" data-reveal data-reveal-stagger="0.08">
        ${ASIDE.map((a) => `
          <div class="apply__aside-item">
            <span class="apply__aside-icon">${a.icon}</span>
            <div><h4>${a.h}</h4><p>${a.p}</p></div>
          </div>`).join('')}
      </aside>
    </div>
  `;

  // Pré-remplissage du poste visé : on remplace l'identifiant (?job=j-002)
  // par l'intitulé réel de l'offre, récupéré dans jobs.json.
  const params = new URLSearchParams(window.location.search);
  const jobParam = params.get('job');
  if (jobParam) {
    const input = target.querySelector('#apply-job');
    if (input) {
      const looksLikeId = /^j-\w+$/i.test(jobParam);
      if (!looksLikeId) input.value = jobParam; // métier libre éventuel
      fetch(`${import.meta.env.BASE_URL}data/jobs.json`)
        .then((r) => r.json())
        .then((data) => {
          const job = (data.jobs || []).find((j) => j.id === jobParam);
          if (job && job.title) {
            input.value = job.company ? `${job.title} — ${job.company}` : job.title;
          }
        })
        .catch(() => {});
    }
  }

  const form = target.querySelector('#apply-form');
  const card = target.querySelector('.apply__form-card');

  const onFocus = (e) => {
    if (!e.target.matches('.glass-field')) return;
    const r = e.target.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    emitParticles(card, r.right - cr.left - 12, r.top - cr.top + r.height / 2);
  };
  const onFileChange = (e) => {
    if (e.target.type !== 'file') return;
    const txt = target.querySelector('#cv-text');
    if (txt && e.target.files[0]) txt.textContent = e.target.files[0].name;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.form-field').forEach((wrap) => {
      const input = wrap.querySelector('.glass-field');
      if (!input) return;
      const bad = input.hasAttribute('required') && !input.value.trim();
      wrap.dataset.error = bad ? 'true' : 'false';
      if (bad) ok = false;
    });
    if (!ok) return;
    form.innerHTML = '<div class="form-success"><h3>Candidature reçue ✓</h3><p>Merci ! Un conseiller vous recontacte sous 24h. Si c\'est urgent : <a href="contact.html">contact direct</a>.</p></div>';
  };

  target.addEventListener('focusin', onFocus);
  target.addEventListener('change', onFileChange);
  form.addEventListener('submit', onSubmit);

  return () => {
    target.removeEventListener('focusin', onFocus);
    target.removeEventListener('change', onFileChange);
    form.removeEventListener('submit', onSubmit);
    target.innerHTML = '';
  };
}

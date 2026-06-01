/**
 * adminTemplate.js — gabarits HTML de la page d'administration des offres.
 * Aucune logique : uniquement la génération de chaînes HTML.
 */

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const field = (id, label, attrs = '') => `
  <div class="form-field">
    <label class="form-label" for="adm-${id}">${label}</label>
    <input class="glass-field" id="adm-${id}" name="${id}" ${attrs}>
  </div>`;

const area = (id, label, hint = '') => `
  <div class="form-field form-field--full">
    <label class="form-label" for="adm-${id}">${label}</label>
    <textarea class="glass-field" id="adm-${id}" name="${id}"></textarea>
    ${hint ? `<span class="adm-hint">${hint}</span>` : ''}
  </div>`;

/**
 * Formulaire d'ajout / édition d'une offre.
 * @param {{ categories: string[], contracts: string[] }} cfg
 * @returns {string} HTML
 */
export function adminFormHTML({ categories, contracts }) {
  const opts = (arr) => arr.map((c) => `<option>${esc(c)}</option>`).join('');
  const today = new Date().toISOString().slice(0, 10);
  return /* html */ `
    <form class="form-grid" id="adm-form" novalidate>
      ${field('title', 'Intitulé du poste *', 'type="text" required')}
      ${field('company', 'Entreprise *', 'type="text" required')}
      <div class="form-field">
        <label class="form-label" for="adm-category">Secteur *</label>
        <select class="glass-field" id="adm-category" name="category" required>${opts(categories)}</select>
      </div>
      <div class="form-field">
        <label class="form-label" for="adm-contract">Contrat *</label>
        <select class="glass-field" id="adm-contract" name="contract" required>${opts(contracts)}</select>
      </div>
      ${field('location', 'Lieu * (ex. Lyon (69))', 'type="text" required')}
      ${field('duration', 'Durée (ex. 3 mois)', 'type="text"')}
      ${field('salary', 'Rémunération (ex. 14,00 €/h)', 'type="text"')}
      ${field('postedAt', 'Date de publication', `type="date" value="${today}"`)}
      <div class="form-field form-field--full adm-check">
        <label class="form-label" for="adm-isNew">
          <input type="checkbox" id="adm-isNew" name="isNew" checked> Marquer comme « Nouveau »
        </label>
      </div>
      ${area('skills', 'Compétences / badges (une par ligne)', 'Ex. CACES R408, Permis B…')}
      ${area('description', 'Description — À propos de la mission *')}
      ${area('missions', 'Vos missions (une par ligne)')}
      ${area('profile', 'Profil recherché (une par ligne)')}
      ${area('perks', 'Ce que nous offrons (une par ligne)')}
      <div class="form-field form-field--full adm-actions">
        <button class="btn btn--primary" type="submit" id="adm-save">
          <span class="btn__inner"><span class="btn__label">Ajouter l'offre</span></span>
        </button>
        <button class="btn btn--ghost" type="button" id="adm-clear">
          <span class="btn__inner"><span class="btn__label">Vider le formulaire</span></span>
        </button>
      </div>
    </form>`;
}

/**
 * Liste des offres existantes (avec boutons modifier / supprimer).
 * @param {object[]} jobs
 * @returns {string} HTML
 */
export function offerRowsHTML(jobs) {
  if (!jobs.length) {
    return '<li class="adm-empty">Aucune offre pour le moment. Ajoutes-en une avec le formulaire.</li>';
  }
  return jobs.map((j, i) => `
    <li class="adm-offer">
      <div class="adm-offer__info">
        <strong>${esc(j.title)}</strong>
        <span>${esc(j.company)} · ${esc(j.category)} · ${esc(j.location)}</span>
      </div>
      <div class="adm-offer__act">
        <button class="adm-mini" type="button" data-edit="${i}">Modifier</button>
        <button class="adm-mini adm-mini--danger" type="button" data-del="${i}">Supprimer</button>
      </div>
    </li>`).join('');
}

/**
 * Coquille complète de la page d'admin.
 * @param {{ categories: string[], contracts: string[] }} cfg
 * @returns {string} HTML
 */
export function adminShellHTML(cfg) {
  return /* html */ `
    <div class="adm">
      <header class="adm__head">
        <h1 class="adm__title">Gestion des offres</h1>
        <p class="adm__lead">
          Ajoute, modifie ou supprime des offres, puis clique <strong>Télécharger jobs.json</strong>.
          Dépose ensuite ce fichier dans le dossier <code>public/data/</code> du dépôt GitHub
          (glisser-déposer → « Commit changes »). Le site se met à jour tout seul en 1-2 min.
        </p>
      </header>

      <div class="adm__grid">
        <section class="adm__col">
          <h2 class="adm__h2">Nouvelle offre</h2>
          ${adminFormHTML(cfg)}
        </section>

        <section class="adm__col">
          <h2 class="adm__h2">Offres actuelles (<span id="adm-count">0</span>)</h2>
          <ul id="adm-list" class="adm__offers"></ul>
          <div class="adm__export">
            <div class="adm__export-btns">
              <button class="btn btn--primary" id="adm-download" type="button">
                <span class="btn__inner"><span class="btn__label">⬇ Télécharger jobs.json</span></span>
              </button>
              <button class="btn btn--ghost" id="adm-copy" type="button">
                <span class="btn__inner"><span class="btn__label">Copier le JSON</span></span>
              </button>
            </div>
            <textarea id="adm-output" class="adm__output" readonly aria-label="Contenu du fichier jobs.json"></textarea>
          </div>
        </section>
      </div>
    </div>`;
}

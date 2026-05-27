/**
 * jobsShell.js — markup du job-board : bandeau recherche bleu + suggestions
 * + layout 3 colonnes (filtres / liste / détail).
 */

const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const PIN_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.8"/></svg>';

/**
 * @param {{ suggestions: string[], sectors: string[], contracts: string[],
 *           contractCounts: object, sectorCounts: object }} cfg
 * @returns {string} HTML
 */
export function buildJobsShellHTML({ suggestions, sectors, contracts, contractCounts, sectorCounts }) {
  const suggestHTML = suggestions.map((s) => `<button class="jb-pill" data-q="${s}">${s}</button>`).join('');

  const contractHTML = contracts.map((c) => `
    <label class="jb-check">
      <input type="checkbox" data-filter="contract" value="${c}">
      <span class="jb-check__label">${c}</span>
      <span class="jb-check__count">${contractCounts[c] || 0}</span>
    </label>`).join('');

  const sectorHTML = sectors.map((s) => `
    <label class="jb-check">
      <input type="checkbox" data-filter="sector" value="${s}">
      <span class="jb-check__label">${s}</span>
      <span class="jb-check__count">${sectorCounts[s] || 0}</span>
    </label>`).join('');

  return /* html */ `
    <div class="jb-searchbar">
      <div class="jb-searchbar__inner container">
        <h1 class="jb-searchbar__title">Trouvez votre prochaine mission.</h1>
        <div class="jb-searchrow">
          <div class="jb-field">${SEARCH_ICON}<input id="jb-q" type="search" placeholder="Métier, mot-clé, entreprise…" autocomplete="off"></div>
          <div class="jb-field jb-field--loc">${PIN_ICON}<input id="jb-loc" type="search" placeholder="Ville, département" autocomplete="off"></div>
          <div class="jb-field jb-field--type">
            <select id="jb-type">
              <option value="">Tous types</option>
              ${contracts.map((c) => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <button id="jb-search" class="btn btn--primary jb-searchbtn">Rechercher</button>
        </div>
        <div class="jb-pills">${suggestHTML}</div>
      </div>
    </div>

    <div class="jb-board container">
      <aside class="jb-filters">
        <div class="jb-filters__head">
          <h3>Filtres</h3>
          <button id="jb-reset" class="jb-filters__reset">Réinitialiser</button>
        </div>
        <div class="jb-fgroup"><h4>Type de contrat</h4>${contractHTML}</div>
        <div class="jb-fgroup"><h4>Secteur</h4>${sectorHTML}</div>
        <div class="jb-fgroup">
          <h4>Publication</h4>
          <label class="jb-radio"><input type="radio" name="jb-pub" value="24h"><span>Dernières 24h</span></label>
          <label class="jb-radio"><input type="radio" name="jb-pub" value="3j"><span>3 derniers jours</span></label>
          <label class="jb-radio"><input type="radio" name="jb-pub" value="7j"><span>7 derniers jours</span></label>
          <label class="jb-radio"><input type="radio" name="jb-pub" value="all" checked><span>Toutes les dates</span></label>
        </div>
        <div class="jb-fgroup">
          <h4>Salaire minimum (€/mois)</h4>
          <input id="jb-salary" class="jb-range" type="range" min="0" max="5000" step="100" value="0">
          <div class="jb-range__row"><span>1 500 €</span><output id="jb-salary-val">Indifférent</output></div>
        </div>
      </aside>

      <section class="jb-list-col">
        <div class="jb-list-head">
          <span id="jb-count" class="jb-count">…</span>
          <label class="jb-sort">Trier
            <select id="jb-sort">
              <option value="pertinence">Pertinence</option>
              <option value="date">Date</option>
              <option value="salaire">Salaire</option>
            </select>
          </label>
        </div>
        <div id="jb-list" class="jb-list"></div>
      </section>

      <section id="jb-detail" class="jb-detail-col"></section>
    </div>
  `;
}

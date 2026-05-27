/**
 * Clients.js — bandeau "ils nous font confiance" (logos texte).
 */

const CLIENTS = ['BTP Solutions', 'Routes & Réseaux', 'Fiducial', 'LogiDis', 'Nova Distribution', 'Volt & Co', 'Aqua Therm', 'RH Partners'];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountClients({ mount } = {}) {
  const target = mount || document.getElementById('clients-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    <div class="clients" data-reveal>
      <p class="clients__label">+ 320 entreprises nous font confiance</p>
      <div class="clients__row">
        ${CLIENTS.map((c) => `<span class="clients__logo">${c}</span>`).join('')}
      </div>
    </div>
  `;
  return () => { target.innerHTML = ''; };
}

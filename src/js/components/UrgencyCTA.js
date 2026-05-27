/**
 * UrgencyCTA.js — bloc de conversion final avec téléphone + CTAs.
 */

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountUrgencyCTA({ mount } = {}) {
  const target = mount || document.getElementById('urgency-mount');
  if (!target) return () => {};

  target.innerHTML = /* html */ `
    <div class="urgency-cta" data-reveal>
      <div class="urgency-cta__pulse" aria-hidden="true"></div>

      <span class="label-eyebrow">
        <span class="label-eyebrow__dot"></span>
        Besoin de quelqu'un sous 48h ?
      </span>

      <h2 class="urgency-cta__title">
        On répond. <span class="text-gradient-blue">Maintenant.</span>
      </h2>

      <p class="urgency-cta__desc">
        Mission urgente côté entreprise, ou recherche pressante côté candidat.
        On est joignable directement. Pas de standard, pas d'attente.
      </p>

      <div class="urgency-cta__row">
        <a class="btn btn--primary btn--lg" href="tel:+33180000000" data-magnetic>
          <span class="btn__inner">
            <span class="btn__label">+33 1 80 00 00 00</span>
            <span class="btn__arrow" aria-hidden="true">→</span>
          </span>
        </a>
        <a class="btn btn--ghost btn--lg" href="/contact.html" data-magnetic>
          <span class="btn__inner">
            <span class="btn__label">Écrire un message</span>
          </span>
        </a>
      </div>

      <span class="urgency-cta__small">
        Lun-Ven 9h à 19h · Réponse garantie sous 24h.
      </span>
    </div>
  `;

  return () => { target.innerHTML = ''; };
}

/**
 * HeroPortal.js — Hero cinématique plein écran (photo + titre massif en surimpression).
 * Geste fort, fiable : grande photographie, scrim sombre pour la lisibilité,
 * titre serif massif. Contenu visible par défaut (entrée CSS légère).
 */

import { bindMagnetic } from './MagneticButton.js';

const HERO_IMG = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80';

const TEMPLATE = /* html */ `
  <section class="hero hero--cinematic">
    <img class="hero__bg" src="${HERO_IMG}" alt="Chantier de construction au lever du jour"
         width="2000" height="1333" loading="eager" fetchpriority="high">
    <div class="hero__scrim"></div>

    <div class="hero__inner">
      <span class="hero__eyebrow">Agence d'intérim · BTP · Tertiaire · Logistique</span>
      <h1 class="hero__title">Le travail qui<br>vous fait avancer.</h1>
      <p class="hero__subtitle">
        Intérim, CDD et CDI partout en France. Un conseiller dédié,
        une réponse sous 48h, des missions qui comptent.
      </p>
      <div class="hero__cta-row">
        <a href="jobs.html" class="btn btn--primary btn--lg" data-magnetic>
          <span class="btn__inner"><span class="btn__label">Voir les offres</span><span class="btn__arrow">→</span></span>
        </a>
        <a href="apply.html" class="btn btn--glass btn--lg" data-magnetic>
          <span class="btn__inner"><span class="btn__label">Déposer un CV</span></span>
        </a>
      </div>
      <dl class="hero__facts">
        <div><dt>15 000</dt><dd>missions par an</dd></div>
        <div><dt>320</dt><dd>entreprises clientes</dd></div>
        <div><dt>48h</dt><dd>délai de réponse</dd></div>
      </dl>
    </div>
  </section>
`;

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountHero({ mount } = {}) {
  const target = mount || document.getElementById('hero-mount');
  if (!target) return () => {};
  target.innerHTML = TEMPLATE;

  requestAnimationFrame(() => target.querySelector('.hero')?.classList.add('is-in'));
  const unbindMag = bindMagnetic(target.querySelectorAll('[data-magnetic]'));
  return () => { unbindMag(); target.innerHTML = ''; };
}

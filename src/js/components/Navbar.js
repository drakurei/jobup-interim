/**
 * Navbar.js — navigation principale sticky.
 *
 * - Logo SVG inline (animé au survol : rotation 3D + glow)
 * - Liens centrés
 * - CTA magnétique "Postuler" à droite
 * - Backdrop-blur qui s'intensifie progressivement au scroll
 */

import { bindMagnetic } from './MagneticButton.js';

const LINKS = [
  { href: 'index.html', label: 'Accueil' },
  { href: 'jobs.html',  label: 'Offres' },
];

const LOGO_SVG = /* html */ `
  <svg class="navbar__logo-svg" viewBox="0 0 220 70" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="nb-ink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3A4150"/><stop offset="100%" stop-color="#1F2430"/>
      </linearGradient>
      <linearGradient id="nb-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4D94F0"/><stop offset="100%" stop-color="#0D47A1"/>
      </linearGradient>
      <linearGradient id="nb-figs" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4D94F0"/><stop offset="100%" stop-color="#0D47A1"/>
      </linearGradient>
    </defs>
    <g transform="translate(0,8)">
      <circle cx="10" cy="22" r="3" fill="url(#nb-figs)"/>
      <rect x="7" y="26" width="6" height="14" rx="2" fill="url(#nb-figs)"/>
      <circle cx="22" cy="16" r="3.5" fill="url(#nb-figs)"/>
      <rect x="18.5" y="20" width="7" height="20" rx="2" fill="url(#nb-figs)"/>
      <circle cx="36" cy="10" r="4" fill="url(#nb-figs)"/>
      <rect x="32" y="14" width="8" height="26" rx="2" fill="url(#nb-figs)"/>
      <path d="M2 44 Q 22 24 44 8" stroke="#1565C0" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M44 8 L 38 8 M44 8 L 44 14" stroke="#1565C0" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </g>
    <text x="56" y="42" font-family="Space Grotesk, sans-serif" font-weight="800" font-size="34" letter-spacing="-1" fill="url(#nb-ink)">JOB</text>
    <text x="118" y="42" font-family="Space Grotesk, sans-serif" font-weight="800" font-size="34" letter-spacing="-1" fill="url(#nb-blue)">UP</text>
    <text x="58" y="60" font-family="Inter, sans-serif" font-weight="600" font-size="12" letter-spacing="3" fill="#1F2430">INTÉRIM</text>
    <line x1="56" y1="48" x2="166" y2="48" stroke="#1E6FE0" stroke-width="1.5"/>
  </svg>
`;

/**
 * Monte la navbar dans le mount point fourni.
 * @param {{ mount?: HTMLElement, currentPage?: string }} options
 * @returns {() => void}  Fonction cleanup
 */
export function mountNavbar({ mount, currentPage = '' } = {}) {
  const target = mount || document.getElementById('navbar-mount');
  if (!target) return () => {};

  const linksHTML = LINKS.map((l) => {
    // 'index.html' → clé 'index' ; on aligne la page 'home' sur 'index'.
    const key = l.href.replace('.html', '').split(/[?#]/)[0];
    const isActive = key === currentPage || (key === 'index' && currentPage === 'home');
    return `<a class="navbar__link${isActive ? ' navbar__link--active' : ''}" href="${l.href}">${l.label}</a>`;
  }).join('');

  target.innerHTML = /* html */ `
    <header class="navbar" data-state="top">
      <div class="navbar__inner container">
        <a class="navbar__brand" href="index.html" aria-label="JOB UP INTÉRIM, accueil">
          ${LOGO_SVG}
        </a>
        <nav class="navbar__nav" aria-label="Navigation principale">
          ${linksHTML}
        </nav>
        <a class="btn btn--primary navbar__cta" href="contact.html" data-magnetic>
          <span class="btn__inner">
            <span class="btn__label">Contact</span>
            <span class="btn__arrow" aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </header>
  `;

  const header = target.querySelector('.navbar');
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 24) header.dataset.state = 'scrolled';
    else header.dataset.state = 'top';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const unbind = bindMagnetic(target.querySelectorAll('[data-magnetic]'));

  return () => {
    window.removeEventListener('scroll', onScroll);
    unbind();
    target.innerHTML = '';
  };
}

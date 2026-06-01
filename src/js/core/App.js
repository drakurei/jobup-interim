/**
 * App.js — orchestrateur principal de chaque page.
 * Charge les styles globaux, détecte les capacités, monte la scène 3D et la navbar.
 * Limité à ≤ 100 lignes (règle modularité atomique).
 */

import '../../styles/main.css';
import '../../styles/grid.css';
import '../../styles/glassmorphism.css';
import '../../styles/animations.css';
import '../../styles/editorial.css';
import '../../styles/buttons.css';
import '../../styles/navbar.css';
import '../../styles/hero.css';
import '../../styles/phonemockup.css';
import '../../styles/sections.css';
import '../../styles/stats.css';
import '../../styles/process.css';
import '../../styles/home-sections.css';
import '../../styles/wordbreaker.css';
import '../../styles/cards.css';
import '../../styles/filters.css';
import '../../styles/jobboard.css';
import '../../styles/footer.css';
import '../../styles/forms.css';
import '../../styles/extras.css';
import '../../styles/approche.css';
import '../../styles/legal.css';

import { mountNavbar } from '../components/Navbar.js';
import { mountFooter } from '../components/Footer.js';
import { initSmoothScroll } from '../animations/SmoothScroll.js';

/**
 * Détecte les capacités d'affichage (utilisé pour adoucir les animations).
 * @returns {{ isHighEnd: boolean, prefersReduced: boolean }}
 */
export function detectCapabilities() {
  const isHighEnd = window.matchMedia('(min-width: 1280px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { isHighEnd, prefersReduced };
}

/**
 * Initialisation commune à toutes les pages.
 * @param {{ page: string, onReady?: (ctx: { caps: object, smooth: object }) => void }} options
 */
export function bootApp({ page, onReady }) {
  document.documentElement.dataset.page = page;
  const caps = detectCapabilities();

  const start = () => {
    // Thème clair neutre : pas de fond 3D animé (flat scandinave).
    mountNavbar({ currentPage: page });
    mountFooter();
    const smooth = initSmoothScroll({ enabled: !caps.prefersReduced });
    if (typeof onReady === 'function') onReady({ caps, smooth });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

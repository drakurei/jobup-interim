/**
 * home.js — entrée page d'accueil (thème clair neutre).
 * Ordre : Hero → Stats → Values → Specialties → Process → Testimonial
 *         → FeaturedJobs → UrgencyCTA.
 */

import { bootApp } from '../js/core/App.js';
import { mountHero } from '../js/components/HeroPortal.js';
import { mountClients } from '../js/components/Clients.js';
import { mountStats } from '../js/components/Stats.js';
import { mountApproche } from '../js/components/Approche.js';
import { mountValues } from '../js/components/Values.js';
import { mountSpecialties } from '../js/components/Specialties.js';
import { mountProcess } from '../js/components/Process.js';
import { mountFeaturedJobs } from '../js/components/FeaturedJobs.js';
import { mountUrgencyCTA } from '../js/components/UrgencyCTA.js';
import { observeReveals } from '../js/animations/ScrollObserver.js';
import { initParallax } from '../js/animations/Parallax.js';
import { bindMagnetic } from '../js/components/MagneticButton.js';

bootApp({
  page: 'home',
  onReady: async ({ smooth } = {}) => {
    mountHero();
    mountClients();
    mountStats();
    mountApproche();
    mountValues();
    mountSpecialties();
    mountProcess();
    await mountFeaturedJobs();
    mountUrgencyCTA();

    bindMagnetic(document.querySelectorAll('#urgency-mount [data-magnetic]'));
    observeReveals();
    initParallax({ lenis: smooth && smooth.lenis });
  },
});

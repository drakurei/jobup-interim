/**
 * jobs.js — entrée page catalogue offres (job-board).
 */

import { bootApp } from '../js/core/App.js';
import { mountJobsCatalog } from '../js/components/JobsCatalog.js';
import { observeReveals } from '../js/animations/ScrollObserver.js';

bootApp({
  page: 'jobs',
  onReady: async () => {
    await mountJobsCatalog();
    observeReveals();
  },
});

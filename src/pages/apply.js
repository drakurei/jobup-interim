/**
 * apply.js — entrée page candidature.
 */

import { bootApp } from '../js/core/App.js';
import { mountApplyForm } from '../js/components/ApplyForm.js';
import { observeReveals } from '../js/animations/ScrollObserver.js';

bootApp({
  page: 'apply',
  onReady: () => {
    mountApplyForm();
    observeReveals();
  },
});

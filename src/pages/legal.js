/**
 * legal.js — entrée commune aux pages légales (mentions / confidentialité / CGU).
 * La page lit la clé dans #legal-mount[data-legal].
 */

import { bootApp } from '../js/core/App.js';
import { mountLegal } from '../js/components/Legal.js';
import { observeReveals } from '../js/animations/ScrollObserver.js';

bootApp({
  page: 'legal',
  onReady: () => {
    mountLegal();
    observeReveals();
  },
});

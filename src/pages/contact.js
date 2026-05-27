/**
 * contact.js — entrée page contact.
 */

import { bootApp } from '../js/core/App.js';
import { mountContactForm } from '../js/components/ContactForm.js';
import { mountFaq } from '../js/components/Faq.js';
import { observeReveals } from '../js/animations/ScrollObserver.js';

bootApp({
  page: 'contact',
  onReady: () => {
    mountContactForm();
    mountFaq();
    observeReveals();
  },
});

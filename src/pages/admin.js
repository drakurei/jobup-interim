/**
 * admin.js — entrée de la page d'administration des offres (outil interne).
 * Page autonome : pas de navbar/footer ni de smooth-scroll, juste l'outil.
 */

import '../styles/main.css';
import '../styles/buttons.css';
import '../styles/forms.css';
import '../styles/admin.css';

import { mountAdmin } from '../js/components/AdminOffers.js';

const start = () => { mountAdmin(); };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}

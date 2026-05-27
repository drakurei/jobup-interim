/**
 * ContactForm.js — formulaire de contact + bloc d'informations avec icônes.
 */

import { sectionHeadingHTML } from './SectionHeading.js';

const IC = {
  mail: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h3l2 5-2 1.5a11 11 0 005.5 5.5L16 13l5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
};

const INFOS = [
  { icon: 'mail',  label: 'Email',          value: '<a href="mailto:hello@jobup-interim.fr">hello@jobup-interim.fr</a>' },
  { icon: 'phone', label: 'Téléphone',      value: '<a href="tel:+33180000000">+33 1 80 00 00 00</a>' },
  { icon: 'pin',   label: 'Bureau',         value: '42 rue de la République<br>75011 Paris' },
  { icon: 'clock', label: 'Disponibilités', value: 'Lun-Ven · 9h à 19h<br><span class="contact__open">● Ouvert maintenant</span>' },
];

/**
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountContactForm({ mount } = {}) {
  const target = mount || document.getElementById('contact-mount');
  if (!target) return () => {};

  const infos = INFOS.map((i) => /* html */ `
    <div class="contact__info-item">
      <span class="contact__info-icon">${IC[i.icon]}</span>
      <div>
        <div class="contact__info-label">${i.label}</div>
        <div class="contact__info-value">${i.value}</div>
      </div>
    </div>`).join('');

  target.innerHTML = /* html */ `
    ${sectionHeadingHTML({
      eyebrow: 'On répond sous 24h',
      title: 'Parlons de votre besoin.',
      subtitle: 'Une mission en tête, une question RH, ou vous recrutez ? Écrivez-nous. Un conseiller vous répond, en vrai, sous 24h ouvrées.',
    })}
    <div class="contact">
      <div class="contact__form-card" data-reveal>
        <form class="form-grid" id="contact-form" novalidate>
          <div class="form-field" data-error="false">
            <label class="form-label" for="ct-name">Nom *</label>
            <input class="glass-field" id="ct-name" name="name" type="text" required>
            <span class="form-error">Ce champ est requis.</span>
          </div>
          <div class="form-field" data-error="false">
            <label class="form-label" for="ct-email">Email *</label>
            <input class="glass-field" id="ct-email" name="email" type="email" required>
            <span class="form-error">Email invalide.</span>
          </div>
          <div class="form-field" data-error="false">
            <label class="form-label" for="ct-phone">Téléphone</label>
            <input class="glass-field" id="ct-phone" name="phone" type="tel">
          </div>
          <div class="form-field" data-error="false">
            <label class="form-label" for="ct-topic">Vous êtes</label>
            <select class="glass-field" id="ct-topic" name="topic">
              <option>Un candidat</option>
              <option>Une entreprise qui recrute</option>
              <option>Presse / Partenariat</option>
              <option>Autre</option>
            </select>
          </div>
          <div class="form-field form-field--full" data-error="false">
            <label class="form-label" for="ct-msg">Message *</label>
            <textarea class="glass-field" id="ct-msg" name="message" required></textarea>
            <span class="form-error">Ce champ est requis.</span>
          </div>
          <div class="form-field form-field--full">
            <button class="btn btn--primary btn--lg" type="submit">
              <span class="btn__inner">
                <span class="btn__label">Envoyer le message</span>
                <span class="btn__arrow">→</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      <aside class="contact__info" data-reveal data-reveal-stagger="0.08">
        ${infos}
      </aside>
    </div>
  `;

  const form = target.querySelector('#contact-form');
  const onSubmit = (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.form-field').forEach((wrap) => {
      const input = wrap.querySelector('.glass-field');
      if (!input) return;
      const empty = input.hasAttribute('required') && !input.value.trim();
      const badEmail = input.type === 'email' && input.value && !input.value.includes('@');
      wrap.dataset.error = (empty || badEmail) ? 'true' : 'false';
      if (empty || badEmail) ok = false;
    });
    if (!ok) return;
    form.innerHTML = /* html */ `
      <div class="form-success">
        <h3>Message envoyé ✓</h3>
        <p>Merci. Un conseiller vous recontacte sous 24h, jours ouvrés.</p>
      </div>
    `;
  };
  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
    target.innerHTML = '';
  };
}

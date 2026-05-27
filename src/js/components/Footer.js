/**
 * Footer.js — pied de page global, monté sur toutes les pages via App.js.
 */

const COLUMNS = [
  {
    title: 'Offres',
    links: [
      { href: '/jobs.html?cat=btp',        label: 'BTP' },
      { href: '/jobs.html?cat=tertiaire',  label: 'Tertiaire' },
      { href: '/jobs.html?cat=logistique', label: 'Logistique' },
      { href: '/jobs.html',                label: 'Toutes les offres' },
    ],
  },
  {
    title: 'Agence',
    links: [
      { href: '/apply.html',  label: 'Postuler' },
      { href: '/contact.html',label: 'Contact' },
      { href: '#process',     label: 'Process' },
      { href: '#about',       label: 'À propos' },
    ],
  },
  {
    title: 'Entreprises',
    links: [
      { href: '#recruteurs', label: 'Recruter via JOB UP' },
      { href: '#tarifs',     label: 'Tarifs' },
      { href: '#temoignages',label: 'Témoignages' },
    ],
  },
];

/**
 * Monte le footer.
 * @param {{ mount?: HTMLElement }} options
 * @returns {() => void}
 */
export function mountFooter({ mount } = {}) {
  const target = mount || document.getElementById('footer-mount');
  if (!target) return () => {};

  const columnsHTML = COLUMNS.map((col) => `
    <div class="footer__col">
      <h4 class="footer__col-title">${col.title}</h4>
      <ul class="footer__list">
        ${col.links.map((l) => `<li><a class="footer__link" href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');

  const year = new Date().getFullYear();

  target.innerHTML = /* html */ `
    <footer class="footer" data-reveal>
      <div class="footer__inner container">
        <div class="footer__brand">
          <div class="footer__brand-mark">
            <span class="footer__brand-job">JOB</span><span class="footer__brand-up">UP</span>
            <span class="footer__brand-tag">INTÉRIM</span>
          </div>
          <p class="footer__pitch">
            Confiance · Accompagnement · Évolution.<br>
            L'agence qui pense les missions comme des marches.
          </p>
          <form class="footer__newsletter" novalidate>
            <input class="glass-field footer__news-field" type="email"
                   placeholder="ton@email.fr" aria-label="Email pour la newsletter">
            <button class="btn btn--primary btn--sm" type="submit">
              <span class="btn__inner"><span class="btn__label">S'inscrire</span></span>
            </button>
          </form>
        </div>

        <nav class="footer__cols" aria-label="Navigation pied de page">
          ${columnsHTML}
        </nav>
      </div>

      <div class="footer__bar container">
        <span>© ${year} JOB UP INTÉRIM. Tous droits réservés.</span>
        <span class="footer__bar-links">
          <a href="/mentions-legales.html">Mentions légales</a> · <a href="/confidentialite.html">Confidentialité</a> · <a href="/cgu.html">CGU</a>
        </span>
      </div>
    </footer>
  `;

  // Newsletter : feedback simple (pas de backend)
  const form = target.querySelector('.footer__newsletter');
  const onSubmit = (e) => {
    e.preventDefault();
    const field = form.querySelector('input');
    if (!field.value || !field.value.includes('@')) {
      field.style.borderColor = 'var(--danger)';
      return;
    }
    form.innerHTML = '<p class="footer__news-success">Merci ! On revient vers toi vite.</p>';
  };
  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
    target.innerHTML = '';
  };
}

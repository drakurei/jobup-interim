/**
 * Legal.js — pages légales (mentions, confidentialité, CGU).
 * Le contenu est un canevas à compléter avec les vraies informations société.
 */

const PAGES = {
  mentions: {
    title: 'Mentions légales',
    intro: 'Informations légales relatives au site et à son éditeur.',
    sections: [
      { h: 'Éditeur du site', p: 'JOB UP INTÉRIM, société par actions simplifiée au capital de 50 000 €, immatriculée au RCS de Paris sous le numéro 000 000 000, dont le siège social est situé 42 rue de la République, 75011 Paris.' },
      { h: 'Directeur de la publication', p: 'Le directeur de la publication est le représentant légal de JOB UP INTÉRIM.' },
      { h: 'Contact', p: 'Email : hello@jobup-interim.fr · Téléphone : +33 1 80 00 00 00.' },
      { h: 'Hébergement', p: 'Le site est hébergé par un prestataire conforme au RGPD. Coordonnées disponibles sur demande.' },
      { h: 'Propriété intellectuelle', p: 'L\'ensemble des contenus (textes, visuels, logo, code) est la propriété de JOB UP INTÉRIM ou de ses partenaires. Toute reproduction sans autorisation est interdite.' },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    intro: 'Comment nous traitons et protégeons vos données personnelles.',
    sections: [
      { h: 'Données collectées', p: 'Nous collectons les données que vous nous transmettez via les formulaires de candidature et de contact : nom, email, téléphone, CV, mission visée.' },
      { h: 'Finalité', p: 'Vos données servent uniquement à traiter votre candidature, vous proposer des missions et vous recontacter. Aucune revente à des tiers.' },
      { h: 'Conservation', p: 'Vos données sont conservées le temps nécessaire au traitement, puis archivées ou supprimées conformément à la réglementation.' },
      { h: 'Vos droits', p: 'Vous disposez d\'un droit d\'accès, de rectification, d\'effacement et d\'opposition. Pour l\'exercer : hello@jobup-interim.fr.' },
      { h: 'Cookies', p: 'Le site utilise un minimum de cookies techniques nécessaires à son fonctionnement. Aucun traceur publicitaire sans votre consentement.' },
    ],
  },
  cgu: {
    title: 'Conditions générales d\'utilisation',
    intro: 'Les règles d\'usage du site JOB UP INTÉRIM.',
    sections: [
      { h: 'Objet', p: 'Les présentes CGU encadrent l\'accès et l\'utilisation du site, de ses offres d\'emploi et de ses formulaires.' },
      { h: 'Accès au service', p: 'Le site est accessible gratuitement. JOB UP INTÉRIM se réserve le droit de faire évoluer ou suspendre le service à tout moment.' },
      { h: 'Candidatures', p: 'En postulant, vous garantissez l\'exactitude des informations fournies. Les candidatures sont traitées sous 24h ouvrées.' },
      { h: 'Responsabilité', p: 'JOB UP INTÉRIM met tout en œuvre pour assurer l\'exactitude des informations publiées, sans garantie d\'exhaustivité. Les offres sont susceptibles d\'évoluer.' },
      { h: 'Droit applicable', p: 'Les présentes CGU sont régies par le droit français. Tout litige relève des tribunaux compétents.' },
    ],
  },
};

/**
 * @param {{ mount?: HTMLElement, key?: string }} options
 * @returns {() => void}
 */
export function mountLegal({ mount, key } = {}) {
  const target = mount || document.getElementById('legal-mount');
  if (!target) return () => {};
  const data = PAGES[key || target.dataset.legal] || PAGES.mentions;

  target.innerHTML = /* html */ `
    <article class="legal" data-reveal>
      <header class="legal__head">
        <span class="legal__eyebrow">JOB UP INTÉRIM</span>
        <h1 class="legal__title">${data.title}</h1>
        <p class="legal__intro">${data.intro}</p>
      </header>
      <div class="legal__body">
        ${data.sections.map((s) => `
          <section class="legal__section">
            <h2>${s.h}</h2>
            <p>${s.p}</p>
          </section>`).join('')}
        <p class="legal__note">Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}. Ce document est un modèle à compléter avec les informations légales définitives de la société.</p>
      </div>
    </article>
  `;
  return () => { target.innerHTML = ''; };
}

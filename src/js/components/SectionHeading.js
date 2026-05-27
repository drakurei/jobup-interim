/**
 * SectionHeading.js — heading réutilisable pour les sections.
 */

/**
 * @param {{ eyebrow?: string, title: string, subtitle?: string, center?: boolean }} data
 * @returns {string} HTML
 */
export function sectionHeadingHTML({ eyebrow, title, subtitle, center = false }) {
  return /* html */ `
    <header class="section-heading${center ? ' section-heading--center' : ''}" data-reveal>
      ${eyebrow ? `<span class="section-heading__eyebrow">${eyebrow}</span>` : ''}
      <h2 class="section-heading__title">${title}</h2>
      ${subtitle ? `<p class="section-heading__subtitle">${subtitle}</p>` : ''}
    </header>
  `;
}

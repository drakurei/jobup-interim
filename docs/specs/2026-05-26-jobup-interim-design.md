# JOB UP INTÉRIM — Site vitrine 4K immersif

**Date :** 2026-05-26
**Stack :** Vite + Three.js + GSAP + Lenis + Vanilla JS ES modules
**Sortie :** Site statique (HTML/CSS/JS pur après build)

---

## 1. Objectif

Site vitrine pour une agence d'intérim positionnée luxe/tech. Expérience immersive 3D, 60fps en 4K, micro-interactions soignées. Style inspiré des vidéos virales freelance TikTok/Instagram : typographie massive, contraste fort, néons subtils, glassmorphism.

## 2. Règles de codage (non négociables)

- **Séparation stricte** : zéro CSS dans HTML, zéro JS dans HTML
- **Modularité atomique** : aucun fichier > 200 lignes
- **Zéro backend** : pas de PHP, pas de BDD, offres simulées via `data/jobs.json`
- **ES modules natifs** côté code source, bundle Vite côté production
- **Code documenté** : JSDoc sur fonctions publiques, commentaires uniquement quand le *pourquoi* n'est pas évident

## 3. Architecture fichiers

```
jobup-interim/
├── index.html              (Accueil — Hero + sections)
├── jobs.html               (Catalogue offres — bento grid)
├── apply.html              (Formulaire candidature)
├── contact.html            (Contact + carte)
├── package.json, vite.config.js
├── public/
│   ├── favicon.svg, logo.svg
│   └── data/jobs.json
└── src/
    ├── styles/
    │   ├── variables.css   (tokens : couleurs, espaces, typo, easings)
    │   ├── main.css        (reset + base + typography)
    │   ├── grid.css        (bento + layouts)
    │   ├── glassmorphism.css
    │   └── animations.css  (keyframes secondaires CSS)
    └── js/
        ├── core/
        │   ├── App.js              (≤ 100 lignes)
        │   └── Scene3D.js          (≤ 150 lignes)
        ├── components/
        │   ├── Navbar.js
        │   ├── HeroPortal.js
        │   ├── ShaderBackground.js
        │   ├── JobCard.js
        │   ├── BentoGrid.js
        │   ├── MagneticButton.js
        │   ├── GlassForm.js
        │   └── ParticleField.js
        ├── animations/
        │   ├── ScrollObserver.js
        │   ├── TransitionManager.js
        │   ├── TiltEffect.js
        │   └── Easings.js
        └── pages/
            ├── home.js, jobs.js, apply.js, contact.js
```

## 4. Palette (variables.css)

Style luxe-tech sombre, dérivé du logo :

| Token | Valeur | Usage |
|---|---|---|
| `--bg-void` | `#0A0A0F` | Fond global |
| `--bg-deep` | `#0F1729` | Sections secondaires |
| `--brand-blue` | `#2196F3` | Bleu logo principal |
| `--brand-deep` | `#0D47A1` | Bleu profond |
| `--brand-glow` | `#64B5F6` | Glow / hover |
| `--neon-accent` | `#4FC3F7` | Highlights, focus |
| `--text-primary` | `#FFFFFF` | Titres |
| `--text-secondary` | `rgba(255,255,255,0.7)` | Corps |
| `--text-muted` | `rgba(255,255,255,0.45)` | Labels |
| `--glass-tint` | `rgba(255,255,255,0.05)` | Surfaces verre |
| `--glass-border` | `rgba(255,255,255,0.1)` | Contour verre |
| `--success` | `#00E676` | Validation |

Typographie :
- **Display** : Space Grotesk (700, 800) — titres massifs
- **Body** : Inter (400, 500, 600)
- **Mono** : JetBrains Mono — accents techniques (numéros offres, IDs)

Easings (portés de Flutter / Material Motion) :
- `--ease-out-expo` : `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-in-out-quart` : `cubic-bezier(0.76, 0, 0.24, 1)`
- `--ease-spring` : `cubic-bezier(0.34, 1.56, 0.64, 1)` (effet ressort)

## 5. Sections

### 5.1 Navbar
- Logo SVG inline (gauche), nav links centrés, CTA "Postuler" à droite (bouton magnétique)
- Sticky avec backdrop-blur progressif au scroll
- Hover logo → rotation 3D légère + glow bleu

### 5.2 Hero (carte blanche)
- Fond : shader mesh-gradient animé (Three.js custom shader) — bleus profonds + grain
- Premier plan : logo JOB UP décomposé en couches SVG, parallaxe 3D au mouvement souris
- Au centre : titre massif "L'AGENCE D'INTÉRIM DU FUTUR" + sous-titre
- Particules 3D flottantes (Three.js Points) qui suivent doucement la souris
- CTA principal magnétique → vers jobs.html

### 5.3 Section "Confiance · Accompagnement · Évolution"
- Bento grid 3 colonnes
- Chaque tuile = carte verre + icône 3D Three.js intégrée

### 5.4 Page Offres (jobs.html)
- Bento grid asymétrique (3 tailles : small, medium, large)
- Chaque JobCard = tilt 3D au hover (perspective CSS + GSAP)
- Filtres : type contrat, métier, lieu — Vanilla JS instantané
- Données chargées depuis `public/data/jobs.json`

### 5.5 Page Candidature (apply.html)
- Formulaire glassmorphism, validation client temps réel
- Au focus d'un champ : particules 3D discrètes sortent du champ
- Bouton submit magnétique + feedback ressort

### 5.6 Page Contact
- Glass card avec infos + formulaire court
- Carte interactive (Leaflet/OSM ou bloc statique stylé)

## 6. Animations & interactions

- **GSAP timelines** pour entrées de section au scroll (IntersectionObserver → GSAP)
- **Lenis** pour smooth scroll natif 60fps
- **Magnetic buttons** : translation suit le curseur dans un rayon de 50px
- **Tilt cards** : rotation X/Y selon position souris dans la carte
- **Page transitions** : fade + slide via TransitionManager (history API)

## 7. Responsive

- **Desktop ≥ 1280px** : expérience 3D complète, Three.js actif
- **Tablet 768-1279px** : Three.js réduit (moins de particules), tilt désactivé
- **Mobile < 768px** : fond gradient CSS statique, animations CSS uniquement, Three.js désactivé pour perf

Détection via `matchMedia('(min-width: 1280px)')` + `prefers-reduced-motion`.

## 8. Performance

- Three.js : `powerPreference: "high-performance"`, antialias selon DPR
- Particules : capped à 200 desktop, 80 tablet, 0 mobile
- Lazy load offres avec IntersectionObserver
- Préchargement fonts via `<link rel="preload">`
- Images logos en SVG inline (zéro requête)
- Build Vite : code splitting auto par page

## 9. Plan de livraison (4 étapes user-validées)

1. **Étape 1** — Setup Vite + arborescence + variables.css + skeletons HTML
2. **Étape 2** — Scene3D.js + ShaderBackground (fond vivant)
3. **Étape 3** — Navbar + HeroPortal (parallaxe logo)
4. **Étape 4** — Pages jobs/apply/contact + composants réutilisables

Validation user requise entre chaque étape.

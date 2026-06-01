# JOB UP INTÉRIM — Site vitrine 

Site vitrine pour agence d'intérim positionnée luxe/tech.

## Démarrage

```bash
npm install
npm run dev      # serveur dev (http://localhost:5173)
npm run build    # bundle production dans /dist
npm run preview  # preview du build (http://localhost:4173)
```

## Architecture

Voir [docs/specs/2026-05-26-jobup-interim-design.md](docs/specs/2026-05-26-jobup-interim-design.md).

## Règles de code (non négociables)

- Aucun fichier ne dépasse 200 lignes
- Zéro CSS dans HTML, zéro JS dans HTML
- ES modules natifs, JSDoc sur fonctions publiques
- Build statique en sortie (zéro backend)
# jobup-interim

import { defineConfig } from 'vite';
import { resolve } from 'path';

// MPA setup : chaque page HTML est une entrée propre. Trois.js, GSAP et Lenis
// sont extraits dans leurs propres chunks pour profiter au mieux du cache.
export default defineConfig({
  root: '.',
  publicDir: 'public',
  // GitHub Pages sert le repo sur le sous-chemin /jobup-interim/
  // En local (npm run dev), `base` est `/` automatiquement (mode: 'serve').
  base: process.env.NODE_ENV === 'production' ? '/jobup-interim/' : '/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        jobs: resolve(__dirname, 'jobs.html'),
        apply: resolve(__dirname, 'apply.html'),
        contact: resolve(__dirname, 'contact.html'),
        mentions: resolve(__dirname, 'mentions-legales.html'),
        confidentialite: resolve(__dirname, 'confidentialite.html'),
        cgu: resolve(__dirname, 'cgu.html'),
      },
      output: {
        manualChunks: {
          gsap: ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },
});

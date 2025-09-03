// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // To jest teraz PRAWIDŁOWE, ponieważ używamy własnego postcss.config.cjs
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  vite: {
    optimizeDeps: {
      exclude: ["@electric-sql/pglite"],
    },
  },
});

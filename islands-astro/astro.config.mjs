// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  /*
  vite: {
    resolve: {
      alias: {
        'react-dom/client': 'react-dom/profiling', //only for profiling builds
      },
    },
  },
  */
});
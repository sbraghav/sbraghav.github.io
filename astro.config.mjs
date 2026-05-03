import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sbraghav.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});

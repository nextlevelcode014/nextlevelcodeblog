// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` gera as URLs absolutas do RSS, do sitemap.xml e das meta tags og:.
// Se o domínio mudar, mude aqui e em public/robots.txt.
export default defineConfig({
  site: 'https://nextlevelcode.pro',

  integrations: [sitemap()],

  build: {
    // Gera /sobre/index.html em vez de /sobre.html — URLs limpas em qualquer host estático.
    format: 'directory',
  },

  // Fonts API nativa do Astro: baixa as fontes no build e serve do seu próprio
  // domínio. Nenhuma requisição do visitante vai para o Google — sem vazamento
  // de IP e sem depender de CDN de terceiros.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Poppins',
      cssVariable: '--font-display',
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],

  // Pré-carrega as páginas ao passar o mouse: navegação instantânea, sem SPA.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  markdown: {
    // GFM (tabelas, listas de tarefas, autolink) já vem ligado por padrão no
    // processador Sätteri — não precisa declarar.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      wrap: true,
    },
  },
});

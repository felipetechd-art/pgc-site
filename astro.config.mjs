import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

// Site 100% estatico: cada rota vira um .html com o conteudo pronto. O motivo da
// migracao nao foi o HTML entregue ao crawler (o site escrito a mao ja era HTML
// completo) e sim o custo de manter 12 copias do mesmo <head>, header e rodape —
// e as pecas de SEO que faltavam porque ninguem lembrava de repetir em cada pagina.
export default defineConfig({
  site: 'https://pgc.ia.br',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({ changefreq: 'weekly', priority: 0.8 }),
  ],
  // format 'file' gera /blog.html e /artigo-x.html, exatamente as URLs que o site
  // escrito a mao ja tinha. E o que permitiu migrar sem um unico redirect: nada
  // que estava indexado mudou de endereco.
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
})

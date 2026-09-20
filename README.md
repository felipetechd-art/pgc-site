# PGC — Plataforma de Gestão Comercial

Site institucional e blog da PGC. **Astro 5**, saída 100% estática, publicado no Cloudflare Pages.

O site era HTML escrito à mão (12 arquivos com `<head>`, cabeçalho e rodapé repetidos). Migrou para
Astro em 09/2026 porque o blog vai passar de 100 artigos: publicar virou escrever um Markdown, e o
cabeçalho/rodapé passou a existir em um lugar só.

## Estrutura

```
src/pages/index.astro       → home (as 17 dobras comerciais)
src/pages/blog.astro        → listagem, montada a partir da coleção
src/pages/[slug].astro      → página de artigo (uma para todos)
src/pages/rss.xml.js        → feed do blog
src/content/blog/*.md       → OS ARTIGOS. Um arquivo = um artigo = uma URL
src/content.config.ts       → schema do artigo (o build falha se faltar campo)
src/layouts/BaseLayout.astro→ <head>, SEO, JSON-LD, cabeçalho, rodapé, scripts
src/components/             → Nav, Footer, IconeArtigo
src/data/site.js            → menu, contato, dados da marca, workspace do chat
src/styles/site.css         → folha única (design system + blog + artigo)
public/assets/              → imagens e JS do site (main.js, widget-ia.js)
public/apresentacao*.html   → páginas soltas, servidas como estão
functions/api/leads.js      → Pages Function que recebe o formulário
scripts/verificar-seo.mjs   → guarda que roda depois do build
```

## Rodar localmente

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera dist/ e roda a guarda de SEO
npm run preview   # serve o dist/ como o Pages serve
```

> Para testar o **chat da IA** em local, abra por `http://localhost:...` (não por `127.0.0.1`):
> a API só aceita origem `localhost`.

## Publicar um artigo

Criar `src/content/blog/artigo-meu-tema.md` — o nome do arquivo vira a URL (`/artigo-meu-tema`):

```yaml
---
titulo: 'Título que aparece na página'
tituloSeo: 'Título do Google | PGC'      # opcional
resumo: 'Vira a meta description e o texto do card.'
data: 2026-09-20
categoria: 'Inteligência Artificial'
leitura: 7
icone: 'ia'                               # ícone do card quando não há capa
capa: '/assets/img/minha-capa.jpg'        # opcional
ctaTitulo: 'Chamada do fim do artigo'
ctaTexto: 'Uma frase sobre o que a PGC faz nesse tema.'
rascunho: false                           # true = não publica
---
```

O `npm run build` falha se faltar campo obrigatório ou se o resumo for curto demais.

## Deploy — Cloudflare Pages

| Configuração | Valor |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 |

As Pages Functions em `functions/` continuam funcionando normalmente.

### URLs

O Pages responde **308 de `/pagina.html` para `/pagina`**. Por isso o site usa URLs **sem
extensão** em links, canonical e sitemap — e as URLs `.html` antigas continuam resolvendo pelo
próprio redirect do Pages. Nada que estava indexado quebrou na migração.

## SEO

`npm run build` roda `scripts/verificar-seo.mjs`, que **falha o build** quando uma página fica sem
`<title>`, sem meta description, sem canonical, sem og:image, sem JSON-LD, com `<title>` repetido,
com link interno quebrado ou com og:image apontando para arquivo inexistente — defeito real que a
versão anterior tinha na home e no blog.

## Pendências conhecidas

- **Chat da IA em produção:** a API (`api.osociohoteleiro.com.br`) ainda não libera a origem
  `pgc.ia.br` no CORS. Em `localhost` funciona; no ar, o chat não responde até o domínio entrar na
  lista.
- **Newsletter do blog:** o formulário não envia para lugar nenhum. Hoje mostra um aviso honesto;
  antes exibia um `alert` de "inscrição simulada".
- **Rastreamento:** GTM / Meta Pixel / GA4 continuam como comentário no `BaseLayout.astro`.
- **`llms.txt`** ainda descreve o site antigo (hero e textos anteriores).

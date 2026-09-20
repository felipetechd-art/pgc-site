/**
 * Guarda de regressão do site da PGC.
 *
 * Roda contra o `dist/` depois do build e falha (exit 1) quando alguma das
 * garantias que este site existe para ter é quebrada. Foi escrita a partir dos
 * defeitos REAIS encontrados na versão escrita à mão, antes da migração:
 *
 *   - og:image apontando para um arquivo que não existe (index e blog)
 *   - nenhuma página com JSON-LD
 *   - sem robots.txt e sem sitemap
 *   - link interno para página que não existe
 *   - duas páginas com o mesmo <title> (canibalização na busca)
 *
 * Uso: node scripts/verificar-seo.mjs [dist]
 */
import fs from 'fs'
import path from 'path'

const RAIZ = process.argv[2] || 'dist'
const MIN_PALAVRAS = 250 // menos que isso não é conteúdo indexável
const erros = []

function paginas(dir) {
  const achadas = []
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name)
    if (item.isDirectory()) achadas.push(...paginas(p))
    else if (item.name.endsWith('.html')) achadas.push(p)
  }
  return achadas
}

function texto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

if (!fs.existsSync(RAIZ)) {
  console.error(`✗ ${RAIZ}/ não existe — rode o build antes.`)
  process.exit(1)
}

// Páginas soltas em public/ (apresentação) não passam pelo layout: ficam de fora.
const SEM_LAYOUT = new Set(['apresentacao.html', 'apresentacao-pdf.html'])

const arquivos = paginas(RAIZ).filter((p) => !SEM_LAYOUT.has(path.basename(p)))
const titulos = new Map()

for (const arquivo of arquivos) {
  const rel = path.relative(RAIZ, arquivo).replace(/\\/g, '/')
  const html = fs.readFileSync(arquivo, 'utf8')
  const falta = (o) => erros.push(`${rel}: sem ${o}`)

  const titulo = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim()
  if (!titulo) falta('<title>')
  else {
    if (titulos.has(titulo)) erros.push(`${rel}: <title> repetido de ${titulos.get(titulo)} — "${titulo}"`)
    titulos.set(titulo, rel)
  }

  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) falta('meta description com pelo menos 50 caracteres')
  if (!/<link rel="canonical"/.test(html)) falta('canonical')
  if (!/<meta property="og:image"/.test(html)) falta('og:image')
  if (!/application\/ld\+json/.test(html)) falta('JSON-LD')
  if (/&lt;script type="application\/ld\+json"/.test(html)) erros.push(`${rel}: JSON-LD escapado como texto`)

  // og:image tem que existir de verdade — foi exatamente o defeito da versão anterior
  const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
  if (og) {
    const caminho = og.replace(/^https?:\/\/[^/]+/, '')
    if (caminho.startsWith('/') && !fs.existsSync(path.join(RAIZ, caminho))) {
      erros.push(`${rel}: og:image aponta para ${caminho}, que não existe no build`)
    }
  }

  const palavras = texto(html).split(' ').length
  if (palavras < MIN_PALAVRAS) erros.push(`${rel}: só ${palavras} palavras de conteúdo`)

  // links internos
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const alvo = m[1]
    if (alvo.startsWith('//')) continue
    const candidatos = [alvo, alvo + 'index.html', alvo.replace(/\/$/, '') + '.html']
    if (!candidatos.some((c) => fs.existsSync(path.join(RAIZ, c)))) {
      erros.push(`${rel}: link interno quebrado -> ${alvo}`)
    }
  }
}

for (const obrigatorio of ['robots.txt', 'sitemap-index.xml', 'rss.xml']) {
  if (!fs.existsSync(path.join(RAIZ, obrigatorio))) erros.push(`falta ${obrigatorio}`)
}

if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s) de SEO no build:\n`)
  for (const e of [...new Set(erros)]) console.error('  · ' + e)
  console.error('')
  process.exit(1)
}

console.log(`✓ SEO ok — ${arquivos.length} páginas verificadas.`)

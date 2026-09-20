import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE } from '../data/site.js'

/** Feed do blog. Com 100+ artigos, e o que permite agregadores e newsletters
 *  acompanharem sem ninguem avisar a cada publicacao. */
export async function GET(context) {
  const artigos = (await getCollection('blog', ({ data }) => !data.rascunho)).sort(
    (a, b) => b.data.data.valueOf() - a.data.data.valueOf()
  )

  return rss({
    title: 'Blog PGC',
    description:
      'Estratégias práticas, artigos técnicos e inteligência operacional para estruturar e escalar operações comerciais.',
    site: context.site || SITE.url,
    items: artigos.map((a) => ({
      title: a.data.titulo,
      description: a.data.resumo,
      pubDate: a.data.data,
      categories: [a.data.categoria],
      link: `/${a.id}`,
    })),
    customData: '<language>pt-br</language>',
  })
}

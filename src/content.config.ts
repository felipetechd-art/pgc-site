import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * Blog. O schema e o que impede o erro mais comum de blog grande: publicar sem
 * resumo, sem data ou sem categoria e so descobrir no ar. Com 100+ artigos,
 * essa validacao no build vale mais que qualquer revisao manual.
 *
 * `slug` nao aparece aqui de proposito: o nome do arquivo E a URL
 * (artigo-x.md -> /artigo-x.html), para as URLs antigas continuarem valendo.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    /** Vai para <title>. Sem ele, usa titulo + marca. */
    tituloSeo: z.string().optional(),
    resumo: z.string().min(40, 'resumo curto demais para virar meta description'),
    /** Linha de apoio sob o titulo. Sem ela, a pagina usa o resumo. */
    subtitulo: z.string().optional(),
    /** Texto do card no blog. Sem ele, o card usa o resumo. */
    chamada: z.string().optional(),
    data: z.date(),
    atualizado: z.date().optional(),
    autor: z.string().default('Equipe PGC'),
    /** 'Inteligência Artificial' | 'Vendas & Conversão' | 'Atendimento' | 'Relacionamento' | 'Gestão Operacional' | 'Processos & Vendas' */
    categoria: z.string(),
    leitura: z.number().default(6),
    /** Capa opcional em /assets/img. Sem ela, o card usa o cabecalho com icone. */
    capa: z.string().optional(),
    capaAlt: z.string().optional(),
    /** Icone do card quando nao ha capa. */
    icone: z.string().default('ia'),
    /** Chamada no fim do artigo. */
    ctaTitulo: z.string(),
    ctaTexto: z.string(),
    /** Tira do menu de destaque sem apagar o arquivo. */
    rascunho: z.boolean().default(false),
  }),
})

export const collections = { blog }

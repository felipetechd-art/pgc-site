/**
 * Dados do site num lugar so. O que estava repetido nas 12 paginas escritas a
 * mao (menu, rodape, contato, textos do <head>) passa a viver aqui.
 */
export const SITE = {
  nome: 'PGC',
  nomeCompleto: 'PGC — Plataforma de Gestão Comercial',
  url: 'https://pgc.ia.br',
  descricao:
    'Centralize marketing, atendimento, vendas, inteligência artificial, automações e gestão em um único sistema. Transforme seu negócio em uma empresa estruturada.',
  /** Card de compartilhamento (WhatsApp, LinkedIn). Gerado em public/assets/img. */
  ogImage: '/assets/img/og-cover.png',
  email: 'contato@pgc.com.br',
  whatsapp:
    'https://wa.me/5511912856095?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20PGC!',
  razaoSocial: 'Razão Social LTDA',
  cnpj: '00.000.000/0001-00',
  /** Chat da IA: a aparencia vem do painel da Automacao, nao daqui. */
  iaWidget: {
    workspace: 'ed65f187-0106-4fd5-a043-0cfb1849a3d2',
    apiUrl: 'https://api.osociohoteleiro.com.br/api',
  },
}

/**
 * Menu. Os filhos apontam para secoes que existem de verdade no index — link de
 * menu para ancora inexistente e erro silencioso, e a guarda de SEO reprova.
 */
export const NAV = [
  {
    label: 'A solução',
    curto: 'Solução',
    href: '/#solucao',
    filhos: [
      { label: 'O caos da operação', href: '/#espelho' },
      { label: 'O falso diagnóstico', href: '/#diagnostico' },
      { label: 'O custo da perda', href: '/#custo' },
      { label: 'A virada', href: '/#transformacao' },
      { label: 'Como a PGC funciona', href: '/#solucao' },
      { label: 'Jornada do cliente', href: '/#jornada' },
      { label: 'Tecnologia e IA', href: '/#tecnologia' },
    ],
  },
  {
    label: 'Recursos',
    href: '/#recursos',
    filhos: [
      { label: 'Todos os recursos', href: '/#recursos' },
      { label: 'Comparação', href: '/#comparacao' },
      { label: 'Para quem é', href: '/#para-quem' },
      { label: 'Implantação', href: '/#implantacao' },
      { label: 'Garantia', href: '/#garantia' },
    ],
  },
  { label: 'Planos', href: '/#planos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Dúvidas', href: '/#faq' },
]

export const RODAPE_NAV = [
  { label: 'A solução', href: '/#solucao' },
  { label: 'Jornada do cliente', href: '/#jornada' },
  { label: 'Recursos', href: '/#recursos' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Dúvidas frequentes', href: '/#faq' },
]

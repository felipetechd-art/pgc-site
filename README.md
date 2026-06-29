# PGC — Sistema Operacional do Mentor Empresário

Landing page / página de vendas da PGC. Site estático (HTML + CSS + JS, sem build), tema claro inspirado em plataformas de tecnologia e educação.

## Estrutura

```
index.html            → página completa (19 dobras)
assets/css/styles.css → design system + estilos
assets/js/main.js     → menu, scroll-reveal, calculadora, FAQ, form multi-step, tracking
assets/img/logo.svg   → logo PGC
```

## Rodar localmente

Basta abrir `index.html` no navegador, ou servir a pasta:

```bash
# Node
npx serve .
# ou Python
python -m http.server 5500
```

## Personalização

Campos editáveis estão marcados com `class="editable"` / `data-edit="..."`:
preços e limites dos planos, vagas/turma, CNPJ, razão social, e-mail, WhatsApp e links legais.
O formulário envia para um endpoint placeholder (`#SUBSTITUIR_ENDPOINT`) — integrar com CRM/checkout.
IDs de rastreamento (GTM / Meta Pixel / GA4) são placeholders no `<head>`.

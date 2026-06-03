---
title: "Quais estratégias você usaria para otimizar o carregamento de uma página web?"
category: frontend
subcategory: performance
tags: [performance, web, otimização, cache, lazy-loading, bundle, lcp, core-web-vitals]
difficulty: pleno
lang: pt
---

## Full Answer

Otimização de carregamento é uma disciplina ampla. As estratégias se organizam em camadas: rede, assets, JavaScript, renderização e percepção do usuário.

**1. Reduzir o tamanho dos assets**

- **Imagens:** use formatos modernos (WebP, AVIF), comprima sem perda visível, defina `width` e `height` explícitos para evitar layout shift
- **JavaScript:** habilite tree-shaking e minificação no bundler; remova dependências não usadas
- **CSS:** remova CSS não utilizado (PurgeCSS), minifique
- **Fontes:** use `font-display: swap`, carregue só os pesos necessários, prefira fontes do sistema quando possível

**2. Carregar apenas o necessário (e no momento certo)**

- **Code splitting:** divida o bundle por rota — o usuário carrega só o JS da página atual
- **Lazy loading de imagens:** `<img loading="lazy">` adia o carregamento de imagens fora da viewport
- **Lazy loading de componentes:** em React, `React.lazy()` + `Suspense` carrega componentes sob demanda
- **Dynamic imports:** `import('./modulo')` para funcionalidades não críticas no carregamento inicial

**3. Cache eficiente**

- Configure headers de cache (`Cache-Control`, `ETag`) para assets estáticos
- Use **content hashing** nos nomes de arquivo (`bundle.a3f9c.js`) — permite cache longo sem stale content
- Utilize **Service Workers** para cache offline e estratégias avançadas (stale-while-revalidate)

**4. Otimizar a entrega via rede**

- **CDN:** sirva assets de servidores geograficamente próximos ao usuário
- **Compressão:** habilite Gzip ou Brotli no servidor — reduz 60–80% do tamanho de texto
- **HTTP/2 ou HTTP/3:** múltiplas requisições paralelas em uma única conexão
- **Preconnect / DNS prefetch:** antecipe conexões a domínios de terceiros

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.exemplo.com">
```

**5. Priorizar o que aparece primeiro (Critical Path)**

- **Inline CSS crítico:** o CSS necessário para a parte visível da página vai no `<head>` inline — evita render-blocking
- **Preload de recursos críticos:** fontes, imagens hero, scripts essenciais

```html
<link rel="preload" as="image" href="/hero.webp">
<link rel="preload" as="font" href="/font.woff2" crossorigin>
```

- **Defer / async em scripts:** evite bloquear o parser HTML

```html
<script defer src="app.js"></script>
```

**6. Renderização e percepção**

- **Skeleton screens** em vez de spinners — o usuário percebe carregamento mais rápido
- **Otimistic UI** — atualize a interface antes da resposta do servidor para ações previsíveis
- **Prefetch de rotas:** Next.js faz isso por padrão com `<Link>` — o bundle da próxima página carrega em background

**Métricas para guiar as decisões (Core Web Vitals)**

| Métrica | O que mede | Meta |
|---------|-----------|------|
| LCP (Largest Contentful Paint) | Tempo para renderizar o maior elemento visível | < 2,5s |
| FID / INP (Interaction to Next Paint) | Tempo de resposta a interações | < 200ms |
| CLS (Cumulative Layout Shift) | Estabilidade visual (evitar saltos de layout) | < 0,1 |

**Por onde começar**

1. Rode o Lighthouse no Chrome DevTools — ele aponta os maiores ganhos
2. Corrija os problemas de maior impacto primeiro (geralmente imagens não otimizadas e JS excessivo)
3. Meça, implemente, meça de novo

## Quick Answer

As principais estratégias são: reduzir assets (compressão, formatos modernos para imagens, tree-shaking no JS), carregar só o necessário (code splitting, lazy loading), usar cache eficiente (content hashing, CDN, Service Workers), otimizar a entrega (Brotli, HTTP/2, preconnect) e priorizar o caminho crítico (CSS inline, preload, defer em scripts). Use Lighthouse para identificar os maiores ganhos e guiar pelas Core Web Vitals (LCP, INP, CLS).

## Flashcard

**P:** Quais são as principais estratégias para otimizar o carregamento de uma página web?

**R:** 1) Reduzir assets: imagens WebP/AVIF, tree-shaking, minificação. 2) Carregar o necessário: code splitting, lazy loading de imagens e componentes. 3) Cache: content hashing + CDN + Service Workers. 4) Rede: Brotli, HTTP/2, preconnect. 5) Critical path: CSS crítico inline, preload de recursos, scripts com `defer`. Meça com Lighthouse e Core Web Vitals (LCP, INP, CLS).

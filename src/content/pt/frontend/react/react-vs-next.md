---
title: "Qual a diferença entre React e Next.js?"
category: frontend
subcategory: react
tags: [react, nextjs, ssr, ssg, framework, spa]
difficulty: junior
lang: pt
---

## Full Answer

React e Next.js resolvem problemas diferentes e atuam em camadas distintas.

**React**

React é uma **biblioteca** de UI. Ela cuida exclusivamente de renderizar componentes e gerenciar estado na interface. Tudo mais — roteamento, busca de dados, bundling, configuração de servidor — fica por sua conta.

**Next.js**

Next.js é um **framework** construído sobre o React. Ele adiciona uma camada de opinião e infraestrutura que o React deliberadamente não fornece:

- **Roteamento baseado em sistema de arquivos** — cada arquivo em `app/` ou `pages/` vira automaticamente uma rota
- **Estratégias de renderização** — SSR (Server-Side Rendering), SSG (Static Site Generation), ISR (Incremental Static Regeneration) e CSR, configuráveis por página
- **Server Components** — componentes que executam no servidor e enviam HTML puro, reduzindo o bundle do cliente
- **API Routes** — endpoints de backend dentro do mesmo projeto
- **Otimizações embutidas** — imagens (`<Image>`), fontes, prefetch de links, code splitting automático

**A diferença prática**

| | React | Next.js |
|---|---|---|
| Tipo | Biblioteca | Framework |
| Roteamento | Manual (React Router, etc.) | Embutido (file-system) |
| Renderização | Apenas CSR por padrão | SSR, SSG, ISR, CSR |
| SEO | Ruim sem configuração extra | Bom por padrão (HTML gerado no servidor) |
| Backend | Não inclui | API Routes embutidas |
| Configuração | Você decide tudo | Opinativo, mas flexível |

**Quando usar cada um:**

- **Só React** — SPAs internas (dashboards, admin panels) onde SEO não importa e você quer controle total sobre a stack.
- **Next.js** — sites públicos, e-commerces, blogs, qualquer coisa onde SEO, performance de carregamento inicial ou renderização no servidor importem.

## Quick Answer

React é uma biblioteca de UI — cuida só de componentes e estado. Next.js é um framework construído sobre o React que adiciona roteamento automático, SSR/SSG, Server Components e API Routes. Use React puro para SPAs internas sem necessidade de SEO; use Next.js quando precisar de renderização no servidor, SEO ou uma solução full-stack.

## Flashcard

**P:** Qual a principal diferença entre React e Next.js?

**R:** React é uma biblioteca de UI (só componentes e estado). Next.js é um framework que usa React e adiciona roteamento por sistema de arquivos, SSR/SSG/ISR, Server Components e API Routes — resolvendo tudo que o React deixa em aberto.

---
title: "Explique como funciona o conceito de SSR, SSG e ISR no Next.js"
category: frontend
subcategory: react
tags: [nextjs, ssr, ssg, isr, renderização, performance, servidor]
difficulty: pleno
lang: pt
---

## Full Answer

Next.js oferece quatro estratégias de renderização. Cada uma define **quando** e **onde** o HTML de uma página é gerado — e isso impacta diretamente performance, SEO e frescor dos dados.

**CSR — Client-Side Rendering (padrão do React puro)**

O servidor envia um HTML vazio. O JavaScript carrega no browser e renderiza o conteúdo. SEO ruim, carregamento inicial lento. Ainda válido para dashboards privados onde SEO não importa.

---

**SSG — Static Site Generation (geração estática)**

O HTML é gerado **em tempo de build** e servido como arquivo estático. É a opção mais rápida — nenhuma computação acontece na requisição.

```jsx
// app/blog/[slug]/page.jsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}
```

**Ideal para:** blogs, documentação, landing pages, qualquer conteúdo que não muda entre deploys.

**Trade-off:** dados ficam desatualizados até o próximo build.

---

**SSR — Server-Side Rendering (renderização no servidor)**

O HTML é gerado **a cada requisição**, no servidor. Os dados são sempre frescos.

```jsx
// app/dashboard/page.jsx
export const dynamic = 'force-dynamic' // desativa cache

export default async function Dashboard() {
  const data = await fetch('https://api.exemplo.com/stats', {
    cache: 'no-store' // nunca usar cache
  })
  const stats = await data.json()
  return <Stats data={stats} />
}
```

**Ideal para:** páginas com dados personalizados por usuário, feeds em tempo real, e-commerce com estoque atualizado.

**Trade-off:** mais lento que SSG — cada requisição exige processamento no servidor.

---

**ISR — Incremental Static Regeneration (regeneração incremental)**

Combina o melhor dos dois: gera estático no build, mas **revalida em background** depois de um intervalo definido. O usuário sempre recebe HTML rápido; os dados se atualizam periodicamente sem rebuild completo.

```jsx
// app/produtos/page.jsx
export default async function Produtos() {
  const data = await fetch('https://api.exemplo.com/produtos', {
    next: { revalidate: 60 } // revalida a cada 60 segundos
  })
  const produtos = await data.json()
  return <ListaProdutos items={produtos} />
}
```

Como funciona:
1. Primeira requisição: Next.js serve o HTML estático gerado no build
2. Após 60s: a próxima requisição ainda recebe o HTML antigo, mas dispara regeneração em background
3. Regeneração completa: próximas requisições recebem o HTML novo

**Ideal para:** páginas de produto, catálogos, conteúdo que muda mas não precisa ser em tempo real.

---

**Comparação**

| | SSG | SSR | ISR | CSR |
|---|---|---|---|---|
| Gerado | Build | Por requisição | Build + revalida | No browser |
| Velocidade | Máxima | Média | Alta | Baixa (inicial) |
| Dados | Estáticos | Sempre frescos | Quase frescos | Frescos |
| SEO | Ótimo | Ótimo | Ótimo | Ruim |
| Custo servidor | Mínimo | Alto | Baixo | Mínimo |
| Ideal para | Blog, docs | Dashboard pessoal, tempo real | Catálogo, e-commerce | SPA privada |

**Regra prática:** comece com SSG. Se os dados precisam ser frescos, avalie ISR. Se precisam ser personalizados por usuário ou em tempo real, use SSR.

## Quick Answer

SSG gera o HTML no build — máxima velocidade, dados estáticos. SSR gera o HTML a cada requisição — dados sempre frescos, mais lento. ISR é o meio-termo: gera estático no build e revalida em background após um intervalo configurável (`revalidate: 60`). A escolha depende de quão frescos os dados precisam ser e se o conteúdo é personalizado por usuário.

## Flashcard

**P:** Qual a diferença entre SSG, SSR e ISR no Next.js?

**R:** SSG: HTML gerado no build, servido estático — rápido, dados fixos até o próximo deploy. SSR: HTML gerado por requisição no servidor — dados sempre frescos, mais lento. ISR: estático no build + revalidação automática em background após intervalo definido (`revalidate`) — combina velocidade do SSG com frescor próximo do SSR.

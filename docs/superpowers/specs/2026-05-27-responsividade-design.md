# Responsividade — Design Spec

**Data:** 2026-05-27  
**Abordagem:** Cirúrgica (Opção A)

## Problema

O projeto já usa Tailwind com breakpoints responsivos (`sm:`, `md:`, `lg:`) na maioria dos componentes, mas tem três buracos:

1. **Navegação mobile ausente** — o Header usa `hidden md:flex` no nav sem nenhum fallback para telas menores. Em mobile, os links de navegação são completamente invisíveis.
2. **Hero causa overflow horizontal** — o glow `w-[600px]` fixo pode causar scroll horizontal em telas menores que 600px. O título `text-6xl` também é grande demais para mobile.
3. **Conteúdo sobreposto** — quando a barra inferior for adicionada, o conteúdo e o footer ficam parcialmente escondidos atrás dela.

## Solução

### Componente: BottomNav

Novo arquivo: `src/components/layout/BottomNav.tsx`

- Componente client-side (`"use client"`)
- Visível apenas em mobile: `fixed bottom-0 left-0 right-0 md:hidden`
- Estilo: `bg-dark-surface border-t border-dark-border`
- Altura: `h-16`
- 3 itens de navegação: Questions, Resume, Storytelling
- Cada item: ícone SVG + label `text-xs font-mono`
- Ativo: `text-blue-400`, inativo: `text-dark-muted hover:text-dark-heading`
- Detecção de rota ativa via `usePathname()` + `startsWith`
- Usa `useLocale()` para construir os hrefs corretos

**Ícones:**
- Questions: grid 2×2 (`<rect>` ou similar)
- Resume: documento com linhas
- Storytelling: balão de fala ou livro

### Layout raiz

Arquivo: `src/app/[locale]/layout.tsx`

- Importa e renderiza `<BottomNav />` após o `<main>`
- O elemento `<main>` recebe `pb-20 md:pb-0` para que o conteúdo não fique atrás da barra

### Footer

Arquivo: `src/components/layout/Footer.tsx`

- Adiciona `pb-20 md:pb-0` no elemento `<footer>` (ou `mb-20 md:mb-0` dependendo do layout raiz)

### Hero

Arquivo: `src/app/[locale]/page.tsx`

- `<section>` do hero: adiciona `overflow-hidden`
- Título `<h1>`: `text-6xl` → `text-4xl sm:text-6xl`

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/components/layout/BottomNav.tsx` | Criado |
| `src/app/[locale]/layout.tsx` | Adiciona `<BottomNav>` + `pb-20 md:pb-0` no main |
| `src/app/[locale]/page.tsx` | `overflow-hidden` + `text-4xl sm:text-6xl` |
| `src/components/layout/Footer.tsx` | `pb-20 md:pb-0` no footer |

## Fora do escopo

- Reescrever layouts existentes que já funcionam com Tailwind
- Adicionar animações de transição na barra inferior
- Alterar qualquer comportamento de desktop

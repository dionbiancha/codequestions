# Responsividade Mobile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar barra de navegação inferior para mobile e corrigir overflow/tamanho de texto no hero.

**Architecture:** Novo componente `BottomNav` fixo na parte inferior da tela, visível apenas em mobile (`md:hidden`). O layout raiz adiciona padding-bottom no `<main>` para que a barra não cubra conteúdo. O hero recebe `overflow-hidden` e o título usa tamanho responsivo.

**Tech Stack:** Next.js App Router, Tailwind CSS, next-intl, React hooks (`usePathname`, `useLocale`)

---

## File Map

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Criar | `src/components/layout/BottomNav.tsx` | Barra de navegação fixa para mobile |
| Modificar | `src/app/[locale]/layout.tsx` | Inclui `<BottomNav>` + `pb-20 md:pb-0` no `<main>` |
| Modificar | `src/app/[locale]/page.tsx` | `overflow-hidden` na section hero + `text-4xl sm:text-6xl` |
| Modificar | `src/components/layout/Footer.tsx` | `pb-20 md:pb-0` no `<footer>` |

---

### Task 1: Criar componente BottomNav

**Files:**
- Create: `src/components/layout/BottomNav.tsx`

- [ ] **Step 1: Criar o arquivo com o componente completo**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const items = [
    {
      href: `/${locale}/questions`,
      label: t("questions"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: `/${locale}/resume`,
      label: t("resume"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      ),
    },
    {
      href: `/${locale}/storytelling`,
      label: t("storytelling"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-dark-surface border-t border-dark-border z-50">
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
                isActive
                  ? "text-blue-400"
                  : "text-dark-muted hover:text-dark-heading"
              }`}
            >
              {item.icon}
              <span className="text-xs font-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/BottomNav.tsx
git commit -m "feat: add BottomNav component for mobile navigation"
```

---

### Task 2: Incluir BottomNav no layout e ajustar padding

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

Estado atual do arquivo:
```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// ...

<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</div>
```

- [ ] **Step 1: Adicionar import e componente no layout**

Substituir o conteúdo do arquivo por:

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'pt')) notFound()
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: include BottomNav in locale layout and add mobile bottom padding"
```

---

### Task 3: Corrigir overflow e tamanho do título no hero

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Adicionar `overflow-hidden` na section hero**

Localizar a linha:
```tsx
<section className="relative text-center mb-24 pt-8 pb-4">
```

Substituir por:
```tsx
<section className="relative text-center mb-24 pt-8 pb-4 overflow-hidden">
```

- [ ] **Step 2: Tornar o título responsivo**

Localizar:
```tsx
<h1 className="font-mono text-6xl font-bold mb-8 leading-none tracking-tight">
```

Substituir por:
```tsx
<h1 className="font-mono text-4xl sm:text-6xl font-bold mb-8 leading-none tracking-tight">
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "fix: contain hero glow overflow and scale title on mobile"
```

---

### Task 4: Ajustar padding do footer para não sobrepor BottomNav

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Adicionar `pb-20 md:pb-12` no footer**

Localizar:
```tsx
<footer className="border-t border-dark-border mt-auto py-12">
```

Substituir por:
```tsx
<footer className="border-t border-dark-border mt-auto py-12 pb-20 md:pb-12">
```

> Nota: `pb-20` sobrescreve o bottom de `py-12` no mobile (5rem). `md:pb-12` restaura o valor original de `py-12` (3rem) no desktop. O padding-top não é afetado em nenhum breakpoint.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "fix: add mobile bottom padding to footer to avoid BottomNav overlap"
```

---

## Verificação final

Após todas as tasks:

- [ ] Abrir a aplicação em modo mobile (DevTools → toggle device toolbar, iPhone 14 ou similar)
- [ ] Verificar que a barra inferior aparece com os 3 links
- [ ] Verificar que o item ativo fica azul ao navegar entre páginas
- [ ] Verificar que nenhum conteúdo fica escondido atrás da barra
- [ ] Verificar que o hero não causa scroll horizontal em telas menores
- [ ] Verificar que desktop não foi afetado (barra deve estar invisível em ≥ 768px)

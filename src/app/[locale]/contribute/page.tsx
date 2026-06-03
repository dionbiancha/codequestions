import { getTranslations, getLocale } from 'next-intl/server'
import { StaticPage } from '@/components/ui/StaticPage'
import { mdToHtml } from '@/lib/content'

const CONTRIBUTE_EN = `
## How to contribute

Contributing to CodeQuestions is easy — you just need to know how to edit a Markdown file and open a GitHub Pull Request.

## Step 1: Fork the repository

Go to the [CodeQuestions GitHub repository](https://github.com/dionbiancha/codequestions) and click **Fork**.

## Step 2: Create a new branch

\`\`\`bash
git checkout -b add/frontend-javascript-closures
\`\`\`

## Step 3: Add your question

Create a new \`.md\` file in the correct folder:

\`\`\`
src/content/en/frontend/javascript/closures.md
\`\`\`

Use this template:

\`\`\`markdown
---
title: "What is a closure in JavaScript?"
category: frontend
subcategory: javascript
tags: [closures, scope, functions]
difficulty: intermediate
lang: en
---

## Full Answer

Your complete answer here...

## Quick Answer

One or two sentences for the interviewer.

## Flashcard

**Q:** What is a closure?

**A:** A function that retains access to its outer scope even after the outer function has returned.
\`\`\`

## Step 4: Open a Pull Request

Push your branch and open a PR against \`main\`. A maintainer will review and merge it.

## Rules

- Questions must be in **English** or **Portuguese**
- All required frontmatter fields must be present
- The three sections (**Full Answer**, **Quick Answer**, **Flashcard**) are required
- Mind Map section is optional
- Be respectful and accurate — cite sources when relevant
`

const CONTRIBUTE_PT = `
## Como contribuir

Contribuir com o CodeQuestions é simples — você só precisa saber editar um arquivo Markdown e abrir um Pull Request no GitHub.

## Passo 1: Faça um fork do repositório

Vá ao [repositório do CodeQuestions no GitHub](https://github.com/dionbiancha/codequestions) e clique em **Fork**.

## Passo 2: Crie um novo branch

\`\`\`bash
git checkout -b add/frontend-javascript-closures
\`\`\`

## Passo 3: Adicione sua pergunta

Crie um novo arquivo \`.md\` na pasta correta:

\`\`\`
src/content/pt/frontend/javascript/closures.md
\`\`\`

Use este template:

\`\`\`markdown
---
title: "O que é um closure em JavaScript?"
category: frontend
subcategory: javascript
tags: [closures, escopo, funções]
difficulty: intermediate
lang: pt
---

## Full Answer

Sua resposta completa aqui...

## Quick Answer

Uma ou duas frases para o entrevistador.

## Flashcard

**P:** O que é um closure?

**R:** Uma função que mantém acesso ao seu escopo externo mesmo após a função externa ter retornado.
\`\`\`

## Passo 4: Abra um Pull Request

Faça push do seu branch e abra um PR contra \`main\`. Um mantenedor vai revisar e fazer o merge.

## Regras

- As perguntas devem estar em **inglês** ou **português**
- Todos os campos obrigatórios do frontmatter devem estar presentes
- As três seções (**Full Answer**, **Quick Answer**, **Flashcard**) são obrigatórias
- A seção Mind Map é opcional
- Seja respeitoso e preciso — cite fontes quando relevante
`

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function ContributePage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? CONTRIBUTE_PT : CONTRIBUTE_EN)
  return <StaticPage title={t('contribute')} html={html} />
}

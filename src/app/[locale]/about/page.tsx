import { getTranslations, getLocale } from 'next-intl/server'
import { StaticPage } from '@/components/ui/StaticPage'
import { mdToHtml } from '@/lib/content'

const ABOUT_EN = `
## What is CodeQuestions?

CodeQuestions is an open-source interview preparation portal built by developers, for developers. It started as a personal project to organize the questions that come up over and over in tech interviews — and grew into a community resource.

## Why open source?

Because the best content comes from people who've been in the room. Every developer who has gone through an interview has something to share. An open PR-based model means the content stays current and community-validated.

## The project

- All content lives in Markdown files in the GitHub repository
- No database, no backend — just a static Next.js site deployed on Vercel
- Anyone can contribute by opening a Pull Request
- Content is available in English and Portuguese

## Get involved

- **Contribute questions:** [How to contribute](/en/contribute)
- **Report issues:** Open an issue on GitHub
- **Support the project:** [Support page](/en/support)
`

const ABOUT_PT = `
## O que é o CodeQuestions?

CodeQuestions é um portal open source de preparação para entrevistas criado por desenvolvedores, para desenvolvedores. Começou como um projeto pessoal para organizar as perguntas que aparecem repetidamente em entrevistas de tecnologia — e cresceu para se tornar um recurso da comunidade.

## Por que open source?

Porque o melhor conteúdo vem de pessoas que estiveram na sala. Todo desenvolvedor que passou por uma entrevista tem algo a compartilhar. Um modelo baseado em PRs significa que o conteúdo fica atualizado e validado pela comunidade.

## O projeto

- Todo o conteúdo fica em arquivos Markdown no repositório do GitHub
- Sem banco de dados, sem backend — apenas um site Next.js estático hospedado no Vercel
- Qualquer pessoa pode contribuir abrindo um Pull Request
- O conteúdo está disponível em inglês e português

## Participe

- **Contribuir com perguntas:** [Como contribuir](/pt/contribute)
- **Reportar problemas:** Abra uma issue no GitHub
- **Apoiar o projeto:** [Página de apoio](/pt/support)
`

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function AboutPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? ABOUT_PT : ABOUT_EN)
  return <StaticPage title={t('about')} html={html} />
}

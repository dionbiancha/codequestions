import { getTranslations, getLocale } from 'next-intl/server'
import { StaticPage } from '@/components/ui/StaticPage'
import { mdToHtml } from '@/lib/content'

const FAQ_EN = `
## What is CodeQuestions?

CodeQuestions is a free, open-source portal with the most asked questions in tech interviews. Each question has a complete answer, a brief interviewer-ready answer, and an interactive flashcard.

## Who can contribute?

Anyone! CodeQuestions is open source. Submit questions by opening a Pull Request on GitHub. See the [Contribute](/en/contribute) page for instructions.

## What languages are supported?

English and Portuguese. Questions can be submitted in either language — you don't need to provide both.

## Is there a mobile app?

Not yet. The web portal is fully responsive and works great on mobile browsers.

## How is my progress stored?

Your study progress (Got it / Needs review) is stored locally in your browser using localStorage. It's private and never sent to any server.

## How can I support the project?

Visit the [Support](/en/support) page. Contributions via GitHub Sponsors, Ko-fi, or Pix are deeply appreciated.
`

const FAQ_PT = `
## O que é o CodeQuestions?

CodeQuestions é um portal gratuito e open source com as perguntas mais feitas em entrevistas de tecnologia. Cada pergunta tem uma resposta completa, uma resposta breve para o entrevistador e um flashcard interativo.

## Quem pode contribuir?

Qualquer pessoa! CodeQuestions é open source. Envie perguntas abrindo um Pull Request no GitHub. Veja a página [Contribuir](/pt/contribute) para instruções.

## Quais idiomas são suportados?

Inglês e português. Perguntas podem ser submetidas em qualquer um dos idiomas — não é necessário fornecer os dois.

## Existe um app mobile?

Ainda não. O portal web é totalmente responsivo e funciona bem em navegadores mobile.

## Como meu progresso é salvo?

Seu progresso de estudo (Sei! / Preciso estudar) é salvo localmente no seu navegador usando localStorage. É privado e nunca enviado para nenhum servidor.

## Como posso apoiar o projeto?

Visite a página [Apoie](/pt/support). Contribuições via GitHub Sponsors, Ko-fi ou Pix são muito apreciadas.
`

export default async function FaqPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? FAQ_PT : FAQ_EN)
  return <StaticPage title={t('faq')} html={html} />
}

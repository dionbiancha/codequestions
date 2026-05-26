import { getLocale, getTranslations } from 'next-intl/server'
import { getQuestion, mdToHtml } from '@/lib/content'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

const FALLBACK_EN = `
## What is StoryTelling in interviews?

StoryTelling is the technique of presenting your professional experience as a coherent narrative rather than a list of facts. HR interviews are not technical — they are designed to understand who you are, how you think, and how you work with others.

## The STAR Method

Use STAR to structure every behavioral answer:

- **S**ituation — Set the context. Where were you, what was the project?
- **T**ask — What was your responsibility or challenge?
- **A**ction — What did YOU specifically do? (Use "I", not "we")
- **R**esult — What was the outcome? Quantify when possible.

## Common HR Questions

**"Tell me about yourself."**
This is not a life story. It is a 2-minute professional pitch: current role → relevant experience → why this company.

**"Why do you want to leave your current job?"**
Focus on growth and opportunity, never on frustration or blame.

**"Tell me about a challenge you faced."**
Use STAR. Choose a real challenge with a positive resolution that shows problem-solving.

**"Where do you see yourself in 5 years?"**
Align your answer with the role and the company's growth. Show ambition without arrogance.

**"What is your biggest weakness?"**
Choose a real weakness you are actively working on. Never say "I work too hard."

## Tips

- Prepare 3-5 STAR stories and adapt them to different questions
- Practice out loud — reading is not the same as speaking
- Keep answers under 3 minutes unless asked for more
- Research the company before the interview — mention specifics
`

const FALLBACK_PT = `
## O que é StoryTelling em entrevistas?

StoryTelling é a técnica de apresentar sua experiência profissional como uma narrativa coerente, não uma lista de fatos. Entrevistas com RH não são técnicas — elas existem para entender quem você é, como você pensa e como você trabalha em equipe.

## O Método STAR

Use STAR para estruturar cada resposta comportamental:

- **S**ituação — Contextualize. Onde você estava, qual era o projeto?
- **T**arefa — Qual era sua responsabilidade ou desafio?
- **A**ção — O que VOCÊ especificamente fez? (Use "eu", não "a gente")
- **R**esultado — Qual foi o resultado? Quantifique quando possível.

## Perguntas Comuns de RH

**"Fale sobre você."**
Não é sua história de vida. É um pitch profissional de 2 minutos: cargo atual → experiência relevante → por que esta empresa.

**"Por que você quer sair do emprego atual?"**
Foque em crescimento e oportunidade — nunca em frustração ou culpa.

**"Fale sobre um desafio que você enfrentou."**
Use o STAR. Escolha um desafio real com resolução positiva que demonstre resolução de problemas.

**"Onde você se vê em 5 anos?"**
Alinhe sua resposta com o cargo e o crescimento da empresa. Mostre ambição sem arrogância.

**"Qual é sua maior fraqueza?"**
Escolha uma fraqueza real que você está trabalhando ativamente. Nunca diga "trabalho demais".

## Dicas

- Prepare 3 a 5 histórias STAR e adapte-as a diferentes perguntas
- Pratique em voz alta — ler não é o mesmo que falar
- Mantenha as respostas abaixo de 3 minutos, salvo se pedirem mais
- Pesquise a empresa antes da entrevista — mencione especificidades
`

export default async function StorytellingPage() {
  const locale = await getLocale()
  const t = await getTranslations('pages')

  const question = await getQuestion(locale, 'soft-skills', 'storytelling')
  const html = question?.fullAnswer ?? null

  const fallbackHtml = await mdToHtml(locale === 'pt' ? FALLBACK_PT : FALLBACK_EN)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-dark-heading mb-2">{t('storytelling')}</h1>
      <p className="text-gray-500 dark:text-dark-muted mb-10">
        {locale === 'pt'
          ? 'Como montar uma narrativa poderosa para a entrevista com o RH.'
          : 'How to build a powerful narrative for your HR interview.'}
      </p>
      <div className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-8">
        <MarkdownRenderer html={html ?? fallbackHtml} />
      </div>
    </div>
  )
}

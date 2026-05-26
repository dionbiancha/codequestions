import { getLocale, getTranslations } from 'next-intl/server'

type Lang = 'pt' | 'en'

const STAR_STEPS: Record<Lang, { letter: string; name: string; desc: string; borderColor: string; textColor: string; bgColor: string }[]> = {
  pt: [
    { letter: 'S', name: 'Situação', desc: 'Contextualize o cenário. Onde você estava? Qual era o projeto?', borderColor: 'border-blue-500/50', textColor: 'text-blue-400', bgColor: 'bg-blue-500/8' },
    { letter: 'T', name: 'Tarefa', desc: 'Qual era a sua responsabilidade específica nesse contexto?', borderColor: 'border-purple-500/50', textColor: 'text-purple-400', bgColor: 'bg-purple-500/8' },
    { letter: 'A', name: 'Ação', desc: 'O que VOCÊ fez? Use "eu". Detalhe suas decisões.', borderColor: 'border-orange-500/50', textColor: 'text-orange-400', bgColor: 'bg-orange-500/8' },
    { letter: 'R', name: 'Resultado', desc: 'Qual foi o impacto? Quantifique: %, R$, tempo, usuários.', borderColor: 'border-green-500/50', textColor: 'text-green-400', bgColor: 'bg-green-500/8' },
  ],
  en: [
    { letter: 'S', name: 'Situation', desc: 'Set the scene. Where were you? What was the project?', borderColor: 'border-blue-500/50', textColor: 'text-blue-400', bgColor: 'bg-blue-500/8' },
    { letter: 'T', name: 'Task', desc: 'What was your specific responsibility in that context?', borderColor: 'border-purple-500/50', textColor: 'text-purple-400', bgColor: 'bg-purple-500/8' },
    { letter: 'A', name: 'Action', desc: 'What did YOU do? Use "I". Detail your decisions.', borderColor: 'border-orange-500/50', textColor: 'text-orange-400', bgColor: 'bg-orange-500/8' },
    { letter: 'R', name: 'Result', desc: 'What was the impact? Quantify: %, $, time saved, users.', borderColor: 'border-green-500/50', textColor: 'text-green-400', bgColor: 'bg-green-500/8' },
  ],
}

const STAR_EXAMPLE: Record<Lang, { letter: string; content: string; textColor: string; borderColor: string }[]> = {
  pt: [
    { letter: 'S', textColor: 'text-blue-400', borderColor: 'border-blue-500/40', content: 'Trabalhava como desenvolvedor frontend num e-commerce com taxa de abandono de 40% no checkout — bem acima da média do mercado.' },
    { letter: 'T', textColor: 'text-purple-400', borderColor: 'border-purple-500/40', content: 'Fui designado para investigar a causa raiz e propor melhorias que reduzissem essa taxa em pelo menos 20% nos próximos 3 meses.' },
    { letter: 'A', textColor: 'text-orange-400', borderColor: 'border-orange-500/40', content: 'Analisei o funil com Hotjar e identifiquei que 60% dos usuários desistiam no formulário de endereço. Reduzi de 12 para 4 campos usando autocomplete de CEP e validação em tempo real.' },
    { letter: 'R', textColor: 'text-green-400', borderColor: 'border-green-500/40', content: 'Em 6 semanas a taxa caiu 31%, gerando R$ 280 mil de receita adicional por mês. A solução foi replicada em outras 3 lojas do grupo.' },
  ],
  en: [
    { letter: 'S', textColor: 'text-blue-400', borderColor: 'border-blue-500/40', content: 'I was a frontend developer at an e-commerce company with a 40% checkout abandonment rate — well above the industry benchmark.' },
    { letter: 'T', textColor: 'text-purple-400', borderColor: 'border-purple-500/40', content: 'I was assigned to investigate the root cause and propose improvements to reduce the rate by at least 20% within 3 months.' },
    { letter: 'A', textColor: 'text-orange-400', borderColor: 'border-orange-500/40', content: 'I analyzed the funnel with Hotjar and found 60% dropped at the address form. I reduced it from 12 to 4 fields with address autocomplete and real-time validation.' },
    { letter: 'R', textColor: 'text-green-400', borderColor: 'border-green-500/40', content: 'In 6 weeks abandonment dropped 31%, generating $50k in additional monthly revenue. The solution was replicated across 3 other stores in the group.' },
  ],
}

const PITCH_STEPS: Record<Lang, { num: string; title: string; desc: string; example: string; color: string }[]> = {
  pt: [
    { num: '01', title: 'Quem sou agora', desc: 'Cargo atual, stack principal e anos de experiência.', example: 'Sou desenvolvedor frontend com 5 anos de experiência em React e TypeScript.', color: 'text-blue-400' },
    { num: '02', title: 'O que já construí', desc: 'Um resultado concreto e relevante para o cargo.', example: 'Na empresa atual, liderei a migração para microfrontends, reduzindo o carregamento em 40%.', color: 'text-purple-400' },
    { num: '03', title: 'Por que aqui', desc: 'Algo específico sobre esta empresa ou este papel.', example: 'Busco a [empresa] porque vocês trabalham com produto real em escala — é onde quero crescer.', color: 'text-green-400' },
  ],
  en: [
    { num: '01', title: 'Who I am now', desc: 'Current role, main stack, years of experience.', example: "I'm a frontend developer with 5 years of experience in React and TypeScript.", color: 'text-blue-400' },
    { num: '02', title: "What I've built", desc: 'One concrete result relevant to this role.', example: "At my current company I led a migration to microfrontends, cutting load time by 40%.", color: 'text-purple-400' },
    { num: '03', title: 'Why here', desc: 'Something specific about this company or this role.', example: "I'm here because [company] works with real product at scale — that's exactly where I want to grow.", color: 'text-green-400' },
  ],
}

const PITCH_FULL: Record<Lang, string> = {
  pt: '"Sou desenvolvedor frontend com 5 anos de experiência em React e TypeScript. Na empresa atual liderei a migração para microfrontends, o que reduziu o tempo de carregamento em 40% e aumentou a satisfação do usuário. Estou buscando a [empresa] porque vocês trabalham com produto real em escala — e é exatamente esse tipo de desafio que quero enfrentar."',
  en: '"I\'m a frontend developer with 5 years of experience in React and TypeScript. At my current company I led a migration to microfrontends, cutting load time by 40% and boosting user satisfaction. I\'m here because [company] builds real product at scale — that\'s exactly the kind of challenge I want to tackle."',
}

const QUESTIONS: Record<Lang, { q: string; why: string; tip: string; answer: string }[]> = {
  pt: [
    {
      q: '"Por que você quer sair do emprego atual?"',
      why: 'O RH quer saber se você está fugindo de algo ou buscando crescimento. A resposta revela seu nível de maturidade profissional.',
      tip: 'Nunca fale mal da empresa, do chefe ou dos colegas. Foque no que a nova oportunidade oferece, não no que você quer escapar.',
      answer: '"Tive uma trajetória incrível lá e aprendi muito. Mas cheguei num ponto onde as entregas ficaram repetitivas e sinto que meu crescimento técnico estagnou. Estou buscando um ambiente com mais desafios e onde eu possa ter mais impacto direto no produto."',
    },
    {
      q: '"Fale sobre um desafio que você enfrentou."',
      why: 'Eles querem ver como você age sob pressão, se você culpa os outros ou assume responsabilidade, e se consegue transformar adversidade em resultado.',
      tip: 'Use STAR. Escolha um desafio técnico ou de equipe. Mostre a sua ação específica — não o que "a gente" fez.',
      answer: '"Tínhamos uma deadline em 2 semanas e nosso dev principal entrou de licença médica. Assumi as tasks críticas, refinei o backlog com o PM cortando escopo não essencial, e distribuí o restante com o time. Entregamos um dia antes — sem hora extra."',
    },
    {
      q: '"Onde você se vê em 5 anos?"',
      why: 'Eles querem avaliar se suas ambições se alinham com o que a empresa pode oferecer e se você pensa no longo prazo.',
      tip: 'Seja honesto e específico para a área técnica. Não diga "não sei" nem invente um plano genérico. Mostre direção, não destino.',
      answer: '"Quero me tornar uma referência técnica em frontend — alguém que outros devs consultam para decisões de arquitetura. Se fizer sentido, um caminho de tech lead seria natural. Mas antes disso, quero entregar impacto real aqui."',
    },
    {
      q: '"Qual é sua maior fraqueza?"',
      why: 'Testam autoconsciência e honestidade. Ninguém acredita em "trabalho demais" ou "sou perfeccionista". Respostas genéricas são piores que fraquezas reais.',
      tip: 'Escolha uma fraqueza real — mas que não seja central para o cargo. Sempre mostre o que você está fazendo para melhorar.',
      answer: '"Tenho tendência de centralizar tarefas porque quero garantir qualidade. Percebi que isso cria gargalo e limita o crescimento do time. Hoje faço pair programming mais frequente e code reviews estruturados para distribuir o conhecimento."',
    },
  ],
  en: [
    {
      q: '"Why do you want to leave your current job?"',
      why: "The recruiter wants to know if you're running away from something or seeking growth. Your answer reveals your level of professional maturity.",
      tip: "Never speak negatively about your employer, manager, or colleagues. Focus on what the new opportunity offers — not what you want to escape.",
      answer: '"I\'ve had an amazing run there and learned a lot. But I\'ve reached a point where my work has become repetitive and I feel my technical growth has plateaued. I\'m looking for an environment with more challenges and where I can have direct impact on the product."',
    },
    {
      q: '"Tell me about a challenge you faced."',
      why: 'They want to see how you act under pressure, whether you blame others or take ownership, and whether you can turn adversity into results.',
      tip: 'Use STAR. Pick a technical or team challenge. Show YOUR specific action — not what "we" did.',
      answer: '"We had a two-week deadline and our lead dev went on medical leave. I took over the critical tasks, refined the backlog with the PM cutting non-essential scope, and redistributed the rest across the team. We delivered a day early — no overtime."',
    },
    {
      q: '"Where do you see yourself in 5 years?"',
      why: "They want to assess whether your ambitions align with what the company can offer and whether you think long-term.",
      tip: "Be honest and specific for the technical track. Don't say \"I don't know\" or make up a generic plan. Show direction, not destination.",
      answer: '"I want to become a technical reference in frontend — someone other devs consult for architecture decisions. If it makes sense, a tech lead path would be natural. But before that, I want to deliver real impact here first."',
    },
    {
      q: '"What is your biggest weakness?"',
      why: "They're testing self-awareness and honesty. Nobody believes \"I work too hard\" or \"I'm a perfectionist.\" Generic answers are worse than real weaknesses.",
      tip: "Pick a real weakness — but one that isn't central to the role. Always show what you're actively doing to improve.",
      answer: '"I tend to centralize tasks because I want to ensure quality. I realized this creates bottlenecks and limits team growth. Now I do more frequent pair programming and structured code reviews to distribute knowledge."',
    },
  ],
}

const TIPS: Record<Lang, string[]> = {
  pt: [
    'Prepare 3 a 5 histórias STAR antes da entrevista e adapte-as a perguntas diferentes',
    'Pratique em voz alta — ler mentalmente não é o mesmo que falar com fluência',
    'Mantenha cada resposta entre 1 e 3 minutos, salvo se pedirem mais',
    'Pesquise a empresa: produto, stack, missão — mencione algo específico na entrevista',
    'Use números sempre que puder: percentual, reais, tempo economizado, usuários impactados',
    'Nunca improvise o "Fale sobre você" — ensaie até soar completamente natural',
  ],
  en: [
    'Prepare 3–5 STAR stories before the interview and adapt them to different questions',
    'Practice out loud — reading in your head is not the same as speaking fluently',
    'Keep each answer between 1 and 3 minutes unless asked for more',
    'Research the company: product, stack, mission — mention something specific in the interview',
    'Use numbers whenever you can: percentages, dollars, time saved, users impacted',
    'Never wing "Tell me about yourself" — rehearse until it sounds completely natural',
  ],
}

const TEXT: Record<Lang, Record<string, string>> = {
  pt: {
    subtitle: 'Como montar uma narrativa poderosa para a entrevista com o RH.',
    intro: 'Entrevistas comportamentais não avaliam seu currículo — avaliam como você conta sua história. Recrutadores decidem em minutos se você é ou não o perfil certo. Uma resposta vaga perde para uma história bem contada, mesmo que a experiência seja menor. O método STAR é o framework mais usado por candidatos bem preparados.',
    starTitle: 'O Método STAR',
    starDesc: 'Toda boa resposta comportamental tem exatamente quatro partes. Use esse framework para estruturar qualquer história que você conta numa entrevista.',
    starExampleTitle: 'Exemplo real com STAR',
    starExampleContext: 'Pergunta: "Fale sobre um desafio técnico que você resolveu."',
    pitchTitle: '"Fale sobre você."',
    pitchSubtitle: 'Pergunta mais comum. Resposta mais desperdiçada.',
    pitchDesc: 'Não é autobiografia — é um pitch de 90 segundos. Três partes, nessa ordem, sem improviso.',
    pitchFull: 'Como soa junto:',
    questionsTitle: 'Perguntas comuns e como respondê-las',
    whyAsk: 'Por que perguntam:',
    tip: 'Como responder:',
    exampleAnswer: 'Exemplo:',
    tipsTitle: 'Checklist de preparação',
    tipsDesc: 'Marque cada item antes de entrar na entrevista.',
  },
  en: {
    subtitle: 'How to build a powerful narrative for your HR interview.',
    intro: 'Behavioral interviews don\'t evaluate your résumé — they evaluate how you tell your story. Recruiters decide in minutes whether you\'re the right fit. A vague answer loses to a well-told story, even with less experience. The STAR method is the framework used by the best-prepared candidates.',
    starTitle: 'The STAR Method',
    starDesc: 'Every good behavioral answer has exactly four parts. Use this framework to structure any story you tell in an interview.',
    starExampleTitle: 'Real-world STAR example',
    starExampleContext: 'Question: "Tell me about a technical challenge you solved."',
    pitchTitle: '"Tell me about yourself."',
    pitchSubtitle: 'Most common question. Most wasted answer.',
    pitchDesc: "It's not a biography — it's a 90-second pitch. Three parts, in this order, no winging it.",
    pitchFull: 'How it sounds together:',
    questionsTitle: 'Common questions and how to answer them',
    whyAsk: 'Why they ask:',
    tip: 'How to answer:',
    exampleAnswer: 'Example:',
    tipsTitle: 'Preparation checklist',
    tipsDesc: 'Check each item before you walk into the interview.',
  },
}

export default async function StorytellingPage() {
  const locale = await getLocale() as Lang
  const t = await getTranslations('pages')
  const lang: Lang = locale === 'pt' ? 'pt' : 'en'

  const tx = TEXT[lang]
  const star = STAR_STEPS[lang]
  const example = STAR_EXAMPLE[lang]
  const pitch = PITCH_STEPS[lang]
  const pitchFull = PITCH_FULL[lang]
  const questions = QUESTIONS[lang]
  const tips = TIPS[lang]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{t('storytelling')}</h1>
        <p className="text-dark-muted mb-6">{tx.subtitle}</p>
        <p className="text-sm text-dark-muted leading-relaxed border-l-2 border-blue-500/40 pl-4">{tx.intro}</p>
      </div>

      {/* STAR Method */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-2">{tx.starTitle}</h2>
        <p className="text-sm text-dark-muted mb-8 leading-relaxed">{tx.starDesc}</p>

        {/* STAR Diagram */}
        <div className="relative mb-3">
          <div className="hidden md:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-dark-border z-0" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {star.map((step) => (
              <div
                key={step.letter}
                className={`relative z-10 flex flex-col items-center text-center bg-dark-surface border ${step.borderColor} rounded-xl p-5`}
              >
                <div
                  className={`w-11 h-11 rounded-full border-2 ${step.borderColor} flex items-center justify-center font-mono font-bold text-xl ${step.textColor} mb-3`}
                >
                  {step.letter}
                </div>
                <h3 className={`font-semibold text-sm ${step.textColor} mb-2`}>{step.name}</h3>
                <p className="text-xs text-dark-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STAR Live Example */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden mt-8">
          <div className="px-5 py-3 border-b border-dark-border flex items-center gap-3">
            <span className="text-xs font-mono text-dark-muted uppercase tracking-widest">{tx.starExampleTitle}</span>
            <span className="text-xs text-dark-muted/60 font-mono">— {tx.starExampleContext}</span>
          </div>
          <div className="divide-y divide-dark-border/40">
            {example.map((ex) => (
              <div key={ex.letter} className="flex gap-4 p-5">
                <span
                  className={`font-mono font-bold text-sm ${ex.textColor} border ${ex.borderColor} w-8 h-8 rounded flex-shrink-0 flex items-center justify-center`}
                >
                  {ex.letter}
                </span>
                <p className="text-sm text-dark-text leading-relaxed">{ex.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Fale sobre você" / "Tell me about yourself" */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-1">{tx.pitchTitle}</h2>
        <p className="text-sm text-dark-muted/60 font-mono mb-2">{tx.pitchSubtitle}</p>
        <p className="text-sm text-dark-muted mb-8 leading-relaxed">{tx.pitchDesc}</p>

        <div className="grid md:grid-cols-3 gap-px bg-dark-border rounded-xl overflow-hidden border border-dark-border mb-4">
          {pitch.map((step) => (
            <div key={step.num} className="bg-dark-bg p-6 flex flex-col">
              <div className={`font-mono text-xs tracking-widest ${step.color} mb-3`}>{step.num}</div>
              <h3 className={`font-semibold text-sm ${step.color} mb-2`}>{step.title}</h3>
              <p className="text-xs text-dark-muted mb-4 leading-relaxed flex-1">{step.desc}</p>
              <div className="pt-4 border-t border-dark-border/50">
                <p className="text-xs text-dark-text/80 italic leading-relaxed">&ldquo;{step.example}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-3">{tx.pitchFull}</p>
          <p className="text-sm text-dark-text leading-relaxed italic">{pitchFull}</p>
        </div>
      </section>

      {/* Common Questions */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-8">{tx.questionsTitle}</h2>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-dark-heading text-base mb-5">{q.q}</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-dark-muted/70 uppercase tracking-widest">{tx.whyAsk}</span>
                    <p className="text-sm text-dark-muted mt-1 leading-relaxed">{q.why}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
                    <span className="text-xs font-mono text-blue-400/80 uppercase tracking-widest">{tx.tip}</span>
                    <p className="text-sm text-dark-muted mt-1 leading-relaxed">{q.tip}</p>
                  </div>
                  <div className="bg-dark-bg border border-dark-border rounded-lg px-4 py-3">
                    <span className="text-xs font-mono text-green-400/80 uppercase tracking-widest">{tx.exampleAnswer}</span>
                    <p className="text-sm text-dark-text mt-2 leading-relaxed italic">{q.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-2">{tx.tipsTitle}</h2>
        <p className="text-sm text-dark-muted mb-6">{tx.tipsDesc}</p>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded border border-dark-border flex-shrink-0 mt-0.5" />
                <span className="text-sm text-dark-muted leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  )
}

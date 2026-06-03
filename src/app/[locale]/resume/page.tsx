import { getLocale, getTranslations } from 'next-intl/server'

type Lang = 'pt' | 'en'

const ATS_RULES: Record<Lang, { icon: string; title: string; desc: string; good?: string; bad?: string }[]> = {
  pt: [
    {
      icon: '✓',
      title: 'Layout de coluna única',
      desc: 'Robôs ATS leem de cima para baixo, da esquerda para a direita. Colunas duplas confundem a leitura e fazem o sistema perder informações.',
      bad: 'Duas colunas side-by-side, barra lateral com habilidades',
      good: 'Uma coluna, seções empilhadas na ordem correta',
    },
    {
      icon: '✓',
      title: 'Sem tabelas, caixas ou gráficos',
      desc: 'Tabelas HTML e elementos visuais são ignorados ou lidos como lixo pelo ATS. Barras de progresso de habilidades são inúteis — o robô não entende "80%".',
      bad: 'Barra "React ████░ 80%", tabela de habilidades',
      good: 'Texto simples: "React, Next.js, TypeScript"',
    },
    {
      icon: '✓',
      title: 'Fontes padrão e legíveis',
      desc: 'Arial, Calibri, Times New Roman. Fontes criativas podem não ser renderizadas corretamente em todos os sistemas.',
      good: 'Arial 11pt, margens de 1.5cm–2cm',
    },
    {
      icon: '✓',
      title: 'Nomes de seção convencionais',
      desc: 'O ATS procura por palavras específicas para identificar seções. Criatividade nos títulos pode fazer o sistema não reconhecer a seção.',
      bad: '"Minha Jornada", "O que sei fazer"',
      good: '"Experiência Profissional", "Habilidades Técnicas", "Formação"',
    },
    {
      icon: '✓',
      title: 'Keywords da vaga no texto',
      desc: 'Copie exatamente as palavras-chave da descrição da vaga e inclua no seu currículo. Se a vaga diz "React.js", escreva "React.js" — não só "React".',
      good: 'Releia a vaga e adicione os termos específicos que ela usa',
    },
    {
      icon: '✓',
      title: 'Formato PDF ou DOCX',
      desc: 'PDF preserva a formatação. DOCX é aceito pela maioria dos ATS. Evite PNG, JPG ou formatos exóticos.',
      good: 'PDF gerado a partir do Word ou Google Docs',
    },
  ],
  en: [
    {
      icon: '✓',
      title: 'Single-column layout',
      desc: 'ATS bots read top-to-bottom, left-to-right. Double columns confuse the parser and cause the system to lose information.',
      bad: 'Two side-by-side columns, sidebar with skills',
      good: 'One column, sections stacked in the right order',
    },
    {
      icon: '✓',
      title: 'No tables, boxes, or graphics',
      desc: 'HTML tables and visual elements are ignored or parsed as garbage by ATS. Skill progress bars are useless — the bot doesn\'t understand "80%".',
      bad: '"React ████░ 80%" bar, skills table',
      good: 'Plain text: "React, Next.js, TypeScript"',
    },
    {
      icon: '✓',
      title: 'Standard, readable fonts',
      desc: 'Arial, Calibri, Times New Roman. Creative fonts may not render correctly across all systems.',
      good: 'Arial 11pt, margins of 0.75in–1in',
    },
    {
      icon: '✓',
      title: 'Conventional section names',
      desc: 'ATS looks for specific words to identify sections. Creative section titles may cause the system to fail to recognize the section.',
      bad: '"My Journey", "What I Know"',
      good: '"Professional Experience", "Technical Skills", "Education"',
    },
    {
      icon: '✓',
      title: 'Job description keywords in your text',
      desc: 'Copy exact keywords from the job description and include them in your resume. If the posting says "React.js", write "React.js" — not just "React".',
      good: 'Re-read the posting and add the exact terms it uses',
    },
    {
      icon: '✓',
      title: 'PDF or DOCX format',
      desc: 'PDF preserves formatting. DOCX is accepted by most ATS systems. Avoid PNG, JPG, or exotic formats.',
      good: 'PDF generated from Word or Google Docs',
    },
  ],
}

const SECTIONS: Record<Lang, { name: string; required: boolean; desc: string }[]> = {
  pt: [
    { name: 'Dados de Contato', required: true, desc: 'Nome, e-mail, telefone, LinkedIn, GitHub, cidade. Sem foto, CPF ou data de nascimento.' },
    { name: 'Resumo Profissional', required: true, desc: '2-3 frases com seu cargo, tecnologia principal e o tipo de impacto que você entrega. Personalize para cada vaga.' },
    { name: 'Habilidades Técnicas', required: true, desc: 'Lista de tecnologias como texto corrido. Agrupe por categoria: Linguagens, Frameworks, Banco de Dados, Ferramentas.' },
    { name: 'Experiência Profissional', required: true, desc: 'Cargo, empresa, período, bullets de resultado. Ordem cronológica reversa (mais recente primeiro).' },
    { name: 'Projetos', required: false, desc: 'Inclua se tiver experiência limitada ou projetos de impacto real. Link do GitHub é um diferencial.' },
    { name: 'Formação Acadêmica', required: true, desc: 'Curso, instituição, ano de conclusão. Sem histórico de notas, salvo se júnior recém-formado.' },
    { name: 'Certificações', required: false, desc: 'Certificações relevantes para a vaga. AWS, Google Cloud, cursos reconhecidos da área.' },
  ],
  en: [
    { name: 'Contact Information', required: true, desc: 'Name, email, phone, LinkedIn, GitHub, city. No photo, SSN, or date of birth.' },
    { name: 'Professional Summary', required: true, desc: '2-3 sentences with your role, main technology, and the type of impact you deliver. Customize for each application.' },
    { name: 'Technical Skills', required: true, desc: 'List of technologies as flowing text. Group by category: Languages, Frameworks, Databases, Tools.' },
    { name: 'Professional Experience', required: true, desc: 'Title, company, dates, result bullets. Reverse chronological order (most recent first).' },
    { name: 'Projects', required: false, desc: 'Include if you have limited experience or high-impact projects. A GitHub link is a strong differentiator.' },
    { name: 'Education', required: true, desc: 'Degree, institution, graduation year. No GPA unless you\'re a recent graduate.' },
    { name: 'Certifications', required: false, desc: 'Certifications relevant to the role. AWS, Google Cloud, recognized industry courses.' },
  ],
}

const BULLETS: Record<Lang, { bad: string; good: string }[]> = {
  pt: [
    {
      bad: 'Trabalhei com React no desenvolvimento de funcionalidades.',
      good: 'Desenvolvi sistema de busca com React e Elasticsearch que reduziu o tempo de resultado em 60%.',
    },
    {
      bad: 'Participei da melhoria da performance da aplicação.',
      good: 'Otimizei o bundle do frontend reduzindo de 4.2 MB para 1.1 MB, melhorando o LCP em 45%.',
    },
    {
      bad: 'Fui responsável pela API do projeto.',
      good: 'Projetei e implementei API REST com Node.js e PostgreSQL, processando 2 mil requisições/segundo com p99 < 80ms.',
    },
  ],
  en: [
    {
      bad: 'Worked with React to develop features.',
      good: 'Built a search system with React and Elasticsearch that reduced result time by 60%.',
    },
    {
      bad: 'Participated in application performance improvements.',
      good: 'Optimized frontend bundle from 4.2 MB to 1.1 MB, improving LCP by 45%.',
    },
    {
      bad: 'Was responsible for the project API.',
      good: 'Designed and implemented a REST API with Node.js and PostgreSQL handling 2k req/s with p99 < 80ms.',
    },
  ],
}

const TEXT: Record<Lang, Record<string, string | string[]>> = {
  pt: {
    title: 'Currículo ATS',
    subtitle: 'Como montar um currículo que passa pelos robôs e convence o recrutador.',
    intro: 'Mais de 90% das grandes empresas usam sistemas ATS (Applicant Tracking System) para filtrar candidatos antes de um humano sequer ver o currículo. Um currículo visualmente bonito pode ser eliminado antes da primeira leitura — se não estiver formatado para ser lido por máquina. Este guia mostra como estruturar um currículo que passa pelo ATS e ainda impressiona o recrutador.',
    atsTitle: 'Regras ATS: o que o robô precisa ver',
    atsDesc: 'Siga essas regras e seu currículo será lido corretamente. Quebre qualquer uma delas e pode ser eliminado antes de um humano te ver.',
    badLabel: 'Evite',
    goodLabel: 'Use',
    sectionsTitle: 'Seções obrigatórias e opcionais',
    required: 'Obrigatório',
    optional: 'Opcional',
    bulletsTitle: 'Escreva bullets que provam impacto',
    bulletsDesc: 'Cada linha de experiência deve responder: o que você fez, como você fez e qual foi o resultado mensurável. Evite verbos vagos como "participei", "auxiliei" ou "trabalhei com".',
    bulletBefore: 'Antes',
    bulletAfter: 'Depois',
    downloadTitle: 'Template pronto para uso',
    downloadDesc: 'Baixe o modelo HTML, abra no navegador e imprima como PDF (Arquivo → Imprimir → Salvar como PDF). Todas as seções já estão estruturadas no formato ATS correto.',
    downloadBtn: 'Baixar template (.html)',
    downloadNote: 'Abra no navegador → Arquivo → Imprimir → Salvar como PDF',
    tipsTitle: 'Checklist final antes de enviar',
    tips: [
      'O layout é de coluna única — sem duas colunas, sem sidebar',
      'As seções têm nomes convencionais (Experiência, Habilidades, Formação)',
      'Cada bullet de experiência começa com verbo de ação e tem um número',
      'Incluí as palavras-chave exatas da vaga no texto do currículo',
      'Não há tabelas, imagens, ícones ou barras de progresso',
      'O resumo profissional está personalizado para esta vaga',
      'O arquivo está em PDF (ou DOCX se o sistema pedir)',
      'O nome do arquivo é: Nome-Sobrenome-Curriculo.pdf',
    ],
  },
  en: {
    title: 'ATS Resume',
    subtitle: "How to build a resume that passes the bots and convinces the recruiter.",
    intro: 'Over 90% of large companies use ATS (Applicant Tracking System) software to filter candidates before a human ever sees a resume. A visually beautiful resume can be eliminated before the first read — if it\'s not formatted to be parsed by a machine. This guide shows you how to structure a resume that passes ATS and still impresses the recruiter.',
    atsTitle: 'ATS Rules: what the bot needs to see',
    atsDesc: 'Follow these rules and your resume will be parsed correctly. Break any one of them and you may be eliminated before a human ever sees you.',
    badLabel: 'Avoid',
    goodLabel: 'Use',
    sectionsTitle: 'Required and optional sections',
    required: 'Required',
    optional: 'Optional',
    bulletsTitle: 'Write bullets that prove impact',
    bulletsDesc: 'Every experience line should answer: what you did, how you did it, and what the measurable result was. Avoid vague verbs like "participated in", "helped with", or "worked on".',
    bulletBefore: 'Before',
    bulletAfter: 'After',
    downloadTitle: 'Ready-to-use template',
    downloadDesc: 'Download the HTML template, open it in your browser and print as PDF (File → Print → Save as PDF). All sections are already structured in the correct ATS format.',
    downloadBtn: 'Download template (.html)',
    downloadNote: 'Open in browser → File → Print → Save as PDF',
    tipsTitle: 'Final checklist before sending',
    tips: [
      'The layout is single-column — no two columns, no sidebar',
      'Section names are conventional (Experience, Skills, Education)',
      'Every experience bullet starts with an action verb and has a number',
      "I included the exact keywords from the job description in my resume text",
      'There are no tables, images, icons, or progress bars',
      'The professional summary is customized for this specific role',
      'The file is in PDF format (or DOCX if the system requires it)',
      'The file name is: FirstName-LastName-Resume.pdf',
    ],
  },
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function ResumePage() {
  const locale = await getLocale() as Lang
  const t = await getTranslations('pages')
  const lang: Lang = locale === 'pt' ? 'pt' : 'en'

  const tx = TEXT[lang]
  const rules = ATS_RULES[lang]
  const sections = SECTIONS[lang]
  const bullets = BULLETS[lang]
  const templateFile = lang === 'pt' ? '/templates/curriculo-ats-pt.html' : '/templates/curriculo-ats-en.html'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{tx.title}</h1>
        <p className="text-dark-muted mb-6">{tx.subtitle}</p>
        <p className="text-sm text-dark-muted leading-relaxed border-l-2 border-blue-500/40 pl-4">{tx.intro}</p>
      </div>

      {/* ATS Rules */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-2">{tx.atsTitle}</h2>
        <p className="text-sm text-dark-muted mb-8 leading-relaxed">{tx.atsDesc}</p>

        <div className="space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-green-400 font-mono font-bold text-sm mt-0.5 flex-shrink-0">{rule.icon}</span>
                <div>
                  <h3 className="font-semibold text-dark-heading text-sm mb-1">{rule.title}</h3>
                  <p className="text-sm text-dark-muted leading-relaxed">{rule.desc}</p>
                </div>
              </div>
              {(rule.bad || rule.good) && (
                <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {rule.bad && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                      <span className="text-xs font-mono text-red-400/80 uppercase tracking-widest block mb-1">{tx.badLabel}</span>
                      <span className="text-xs text-dark-muted">{rule.bad}</span>
                    </div>
                  )}
                  {rule.good && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                      <span className="text-xs font-mono text-green-400/80 uppercase tracking-widest block mb-1">{tx.goodLabel}</span>
                      <span className="text-xs text-dark-muted">{rule.good}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-8">{tx.sectionsTitle}</h2>
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="divide-y divide-dark-border/50">
            {sections.map((sec, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${
                  sec.required
                    ? 'text-blue-400 border-blue-500/30 bg-blue-500/5'
                    : 'text-dark-muted border-dark-border'
                }`}>
                  {sec.required ? tx.required : tx.optional}
                </span>
                <div>
                  <h3 className="font-semibold text-dark-heading text-sm mb-1">{sec.name}</h3>
                  <p className="text-xs text-dark-muted leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bullets */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-2">{tx.bulletsTitle}</h2>
        <p className="text-sm text-dark-muted mb-8 leading-relaxed">{tx.bulletsDesc}</p>

        <div className="space-y-4">
          {bullets.map((b, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <span className="text-xs font-mono text-red-400/80 uppercase tracking-widest block mb-2">{tx.bulletBefore}</span>
                <p className="text-sm text-dark-muted leading-relaxed">{b.bad}</p>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                <span className="text-xs font-mono text-green-400/80 uppercase tracking-widest block mb-2">{tx.bulletAfter}</span>
                <p className="text-sm text-dark-text leading-relaxed">{b.good}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-2">{tx.downloadTitle}</h2>
        <p className="text-sm text-dark-muted mb-6 leading-relaxed">{tx.downloadDesc}</p>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 18 15 15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-heading">
                    {lang === 'pt' ? 'curriculo-ats-pt.html' : 'resume-ats-en.html'}
                  </p>
                  <p className="text-xs text-dark-muted">{tx.downloadNote}</p>
                </div>
              </div>
            </div>
            <a
              href={templateFile}
              download
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              {tx.downloadBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-6">{tx.tipsTitle}</h2>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <ul className="space-y-3">
            {(tx.tips as string[]).map((tip: string, i: number) => (
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

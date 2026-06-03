import { getTranslations, getLocale } from 'next-intl/server'

type ChangelogEntry = {
  date: string
  version: string
  title: string
  titlePt: string
  points: string[]
  pointsPt: string[]
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-06-03',
    version: '1.6.0',
    title: 'Global navigation progress bar & loading skeletons',
    titlePt: 'Barra de progresso global e skeletons de carregamento',
    points: [
      'Added a blue progress bar at the top of the page that appears instantly on any link click',
      'Added loading skeletons to all routes — visual feedback while content loads instead of a blank wait',
    ],
    pointsPt: [
      'Barra de progresso azul no topo da página que aparece instantaneamente em qualquer clique de link',
      'Skeletons de carregamento em todas as rotas — feedback visual enquanto o conteúdo carrega, sem espera em branco',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.5.0',
    title: 'Instant navigation across all pages',
    titlePt: 'Navegação instantânea em todas as páginas',
    points: [
      'All pages are now statically generated at build time — navigation is instant instead of waiting for the server',
      'Added loading skeletons on home and questions routes for immediate visual feedback on slow networks',
    ],
    pointsPt: [
      'Todas as páginas agora são geradas de forma estática no build — navegação instantânea sem esperar o servidor',
      'Adicionados skeletons de carregamento nas rotas home e questões para feedback visual imediato em redes lentas',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.4.0',
    title: 'Filter redesign: seniority pills & tag search',
    titlePt: 'Filtros redesenhados: pills de nível e busca de tags',
    points: [
      'Replaced flat tag button list with a search input — type to filter, click to add as chip',
      'Added seniority level filter pills (Junior / Mid-level / Senior / Specialist) with multi-select',
      'Filter logic: level AND tags — questions must match both active filters',
      'Keyboard shortcuts: Enter selects top suggestion, Escape clears input, Backspace removes last chip',
      'Clear all filters with one click',
    ],
    pointsPt: [
      'Lista gigante de botões de tag substituída por input de busca — digite para filtrar, clique para adicionar como chip',
      'Filtro de nível de senioridade com pills multi-seleção (Júnior / Pleno / Sênior / Especialista)',
      'Lógica combinada: nível E tags — questões aparecem quando atendem ambos os filtros ativos',
      'Atalhos de teclado: Enter seleciona primeira sugestão, Escape limpa o input, Backspace remove último chip',
      'Limpar todos os filtros com um clique',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.3.0',
    title: 'Seniority levels & Updates page',
    titlePt: 'Níveis de senioridade e página de Atualizações',
    points: [
      'Replaced generic difficulty labels (beginner/intermediate/advanced) with job seniority levels (Junior/Mid-level/Senior/Specialist)',
      'Added this Updates page to track project improvements over time',
    ],
    pointsPt: [
      'Rótulos genéricos de dificuldade (beginner/intermediate/advanced) substituídos por níveis de cargo (Júnior/Pleno/Sênior/Especialista)',
      'Adicionada esta página de Atualizações para registrar melhorias ao longo do tempo',
    ],
  },
  {
    date: '2026-05-26',
    version: '1.2.0',
    title: 'New questions & community contributions',
    titlePt: 'Novas perguntas e contribuições da comunidade',
    points: [
      'Added Backend questions: Node.js middlewares',
      'Added Frontend questions: web accessibility',
      'Added DevOps questions: Docker, Kubernetes, containers vs VMs',
      'Added Architecture questions: scalable software architecture',
    ],
    pointsPt: [
      'Novas perguntas de Backend: middlewares no Node.js',
      'Novas perguntas de Frontend: acessibilidade web',
      'Novas perguntas de DevOps: Docker, Kubernetes, containers vs VMs',
      'Novas perguntas de Arquitetura: arquitetura de software escalável',
    ],
  },
  {
    date: '2026-05-10',
    version: '1.1.0',
    title: 'Syntax highlighting, analytics & polish',
    titlePt: 'Syntax highlighting, analytics e melhorias visuais',
    points: [
      'Integrated Shiki for syntax highlighting in code blocks',
      'Added GitHub Flavored Markdown (GFM) support',
      'Integrated Vercel Analytics',
      'Updated favicon and app icons',
      'Fixed GitHub contributors API authentication',
    ],
    pointsPt: [
      'Syntax highlighting em blocos de código com Shiki',
      'Suporte a GitHub Flavored Markdown (GFM)',
      'Analytics integrado via Vercel Analytics',
      'Atualização de favicon e ícones do app',
      'Correção na autenticação da API de contribuidores do GitHub',
    ],
  },
  {
    date: '2026-05-01',
    version: '1.0.0',
    title: 'Initial launch',
    titlePt: 'Lançamento inicial',
    points: [
      'Open-source interview preparation portal for developers',
      'Questions in English and Portuguese',
      'Full answer, quick answer, and interactive flashcard for each question',
      'Study progress saved locally in the browser — no login required',
      'Categories: Frontend, Backend, DevOps, Architecture, Security, Soft Skills',
    ],
    pointsPt: [
      'Portal open source de preparação para entrevistas para desenvolvedores',
      'Perguntas em inglês e português',
      'Resposta completa, resposta rápida e flashcard interativo para cada pergunta',
      'Progresso de estudo salvo localmente no navegador — sem cadastro',
      'Categorias: Frontend, Backend, DevOps, Arquitetura, Segurança, Soft Skills',
    ],
  },
]

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function UpdatesPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const isPt = locale === 'pt'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-dark-heading mb-2">
        {t('updates')}
      </h1>
      <p className="text-gray-500 dark:text-dark-muted mb-10">
        {isPt
          ? 'O que foi melhorado, corrigido e adicionado ao longo do tempo.'
          : 'What has been improved, fixed, and added over time.'}
      </p>

      <div className="flex flex-col gap-8">
        {CHANGELOG.map((entry) => (
          <div
            key={entry.version}
            className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-2 py-0.5">
                v{entry.version}
              </span>
              <span className="text-xs text-gray-400 dark:text-dark-muted font-mono">
                {entry.date}
              </span>
            </div>
            <h2 className="font-mono font-bold text-gray-900 dark:text-dark-heading text-lg mb-3">
              {isPt ? entry.titlePt : entry.title}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {(isPt ? entry.pointsPt : entry.points).map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-dark-text">
                  <span className="text-blue-400 mt-0.5 shrink-0">–</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

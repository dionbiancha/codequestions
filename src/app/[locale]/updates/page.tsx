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
    date: '2026-06-05',
    version: '1.8.0',
    title: 'Category page redesign — filterable list with progress',
    titlePt: 'Redesign da página de categorias — lista filtrável com progresso',
    points: [
      'Replaced the card grid with a full-width vertical list — cleaner and more readable',
      'Each category now shows a progress bar and a "X/total completed" label based on your local study history',
      'Added a filter bar with text search and quick chips: all / with progress / not started',
      'Renamed "Create Test" to "Quiz" throughout the app for consistency',
    ],
    pointsPt: [
      'Grid de cards substituído por lista vertical full-width — mais limpa e legível',
      'Cada categoria agora exibe uma barra de progresso e o contador "X/total concluídas" baseado no histórico de estudo local',
      'Adicionada barra de filtro com busca por texto e chips rápidos: todas / com progresso / não iniciadas',
      'Renomeado "Criar Teste" para "Quiz" em todo o app para maior consistência',
    ],
  },
  {
    date: '2026-06-05',
    version: '1.7.0',
    title: 'Custom quiz mode',
    titlePt: 'Modo de teste customizado',
    points: [
      'Create a custom quiz from the question list or category hub — select categories, number of questions, seniority level, tags, and an optional timer',
      'Answer each question with three options: Got it / Sort of / Wrong',
      'Final report with overall score, breakdown by category, and a link to each question',
      'Test history saved locally in the browser — no login required',
      'Access past tests from the quiz setup modal',
    ],
    pointsPt: [
      'Crie um teste customizado pela lista de perguntas ou pelo hub de categorias — escolha categorias, número de perguntas, senioridade, tags e um tempo opcional',
      'Responda cada pergunta com três opções: Acertei / Mais ou menos / Errei',
      'Relatório final com aproveitamento geral, breakdown por categoria e link para cada pergunta',
      'Histórico de testes salvo localmente no navegador — sem cadastro',
      'Acesse testes anteriores pelo modal de criar teste',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.6.2',
    title: 'Fix: skeleton overlay flashing and page visible in background',
    titlePt: 'Correção: skeleton piscando e página aparecendo no fundo',
    points: [
      'Fixed skeleton overlay flashing — animate-pulse was applied to the full-screen container, making the background semi-transparent on each pulse cycle',
      'Fixed current page showing through the skeleton — background is now always fully opaque',
    ],
    pointsPt: [
      'Corrigido skeleton piscando — o animate-pulse estava aplicado no container de tela cheia, deixando o fundo semi-transparente a cada ciclo da animação',
      'Corrigida página atual aparecendo atrás do skeleton — o fundo agora é sempre totalmente opaco',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.6.1',
    title: 'Fix: blank page on navigation — stay on current page while loading',
    titlePt: 'Correção: tela em branco na navegação — permanece na página atual durante o carregamento',
    points: [
      'Fixed blank page bug caused by loading skeletons hiding content for 3 seconds',
      'Current page now stays visible while the next page loads — no more empty screen on click',
      'Skeleton overlay appears only after 5 seconds of loading, covering the current page',
      'Progress bar animates over the full 5-second window before skeleton is shown',
    ],
    pointsPt: [
      'Corrigido bug de tela em branco causado pelos skeletons escondendo o conteúdo por 3 segundos',
      'A página atual agora permanece visível enquanto a próxima página carrega — sem tela em branco ao clicar',
      'Skeleton de carregamento aparece apenas após 5 segundos, cobrindo a página atual',
      'Barra de progresso anima durante toda a janela de 5 segundos antes do skeleton ser exibido',
    ],
  },
  {
    date: '2026-06-03',
    version: '1.6.0',
    title: 'Global navigation progress bar & smart loading skeletons',
    titlePt: 'Barra de progresso global e skeletons de carregamento inteligentes',
    points: [
      'Added a blue progress bar at the top of the page that appears instantly on any link click',
      'Added loading skeletons to all routes — shown only if loading takes longer than 3 seconds',
      'Fast navigations (under 3s) show only the progress bar — no skeleton flash',
    ],
    pointsPt: [
      'Barra de progresso azul no topo da página que aparece instantaneamente em qualquer clique de link',
      'Skeletons de carregamento em todas as rotas — exibidos apenas se o carregamento demorar mais de 3 segundos',
      'Navegações rápidas (menos de 3s) exibem apenas a barra — sem flash de skeleton desnecessário',
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

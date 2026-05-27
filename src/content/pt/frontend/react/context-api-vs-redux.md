---
title: "Qual a diferença entre Context API e Redux no gerenciamento de estado?"
category: frontend
subcategory: react
tags: [react, context, redux, estado, gerenciamento, performance]
difficulty: intermediate
lang: pt
---

## Full Answer

Context API e Redux resolvem o mesmo problema superficialmente — compartilhar estado entre componentes sem prop drilling — mas têm filosofias, capacidades e casos de uso bem diferentes.

**Context API**

É nativa do React. Permite passar dados pela árvore de componentes sem precisar passar props manualmente em cada nível.

```jsx
const ThemeContext = createContext()

function App() {
  const [theme, setTheme] = useState('dark')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  )
}

function Button() {
  const { theme } = useContext(ThemeContext)
  return <button className={theme}>Clique</button>
}
```

**Limitações do Context:**
- Todo componente que consome um contexto re-renderiza quando qualquer valor do provider muda — mesmo que aquele componente não use o valor alterado
- Não tem ferramentas de debug nativas
- Sem padrão para lidar com lógica assíncrona (fetches, side effects)
- Difícil de escalar quando o estado é grande e frequentemente atualizado

**Redux**

É uma biblioteca externa baseada em três princípios: store única, estado imutável, e mudanças apenas via actions + reducers.

```js
// action
dispatch({ type: 'INCREMENT' })

// reducer
function counter(state = 0, action) {
  if (action.type === 'INCREMENT') return state + 1
  return state
}
```

**Vantagens do Redux:**
- Re-renders otimizados — componentes re-renderizam só quando o slice de estado que consomem muda
- Redux DevTools — viagem no tempo, replay de actions, inspeção do estado
- Middleware para async (Redux Thunk, Redux Saga)
- Previsível e testável por design
- Escalável para apps grandes com estado complexo

**Comparação direta**

| | Context API | Redux |
|---|---|---|
| Origem | Nativa do React | Biblioteca externa |
| Boilerplate | Mínimo | Médio (menor com Redux Toolkit) |
| Performance | Re-renders excessivos em estados dinâmicos | Otimizado com seletores |
| DevTools | Não tem | Redux DevTools excelente |
| Async | Manual (useEffect) | Middleware nativo (Thunk/Saga) |
| Curva de aprendizado | Baixa | Média |
| Ideal para | Estado estático/pouco alterado | Estado global complexo e dinâmico |

**Quando usar cada um:**

Use **Context API** para:
- Tema (dark/light mode)
- Idioma / internacionalização
- Dados do usuário autenticado
- Qualquer estado que muda raramente

Use **Redux** (ou Redux Toolkit) para:
- Estado que muda com frequência e é consumido por muitos componentes
- Lógica de negócio complexa
- Necessidade de debugging avançado
- Apps de médio a grande porte

**Alternativas modernas**

Zustand e Jotai surgiram como meio-termo: API simples como Context, performance e DevTools próximos do Redux.

## Quick Answer

Context API é nativa do React e ótima para estado que muda raramente (tema, idioma, usuário logado), mas causa re-renders em todos os consumidores quando atualizada. Redux é uma biblioteca externa com store centralizada, re-renders otimizados por seletores, DevTools poderosas e suporte nativo a async — ideal para estado global complexo e frequentemente atualizado.

## Flashcard

**P:** Quando usar Context API vs Redux?

**R:** Context API: nativa, sem boilerplate, boa para estado estático (tema, usuário, idioma) — mas re-renderiza todos os consumidores a cada mudança. Redux: biblioteca externa, re-renders otimizados, DevTools, middleware async — ideal para estado dinâmico, complexo e consumido por muitos componentes.

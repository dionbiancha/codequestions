---
title: "O que são `useMemo` e `useCallback`, e quando usá-los?"
category: frontend
subcategory: react
tags: [react, hooks, usememo, usecallback, performance, memoização]
difficulty: intermediate
lang: pt
---

## Full Answer

`useMemo` e `useCallback` são hooks de memoização do React — eles evitam recálculos ou recriações desnecessárias entre renders. A diferença está no que cada um memoriza.

**`useMemo` — memoiza um valor**

Recalcula o valor somente quando as dependências mudam. Útil para cálculos custosos.

```jsx
const total = useMemo(() => {
  return orders.reduce((sum, order) => sum + order.value, 0)
}, [orders])
```

Sem `useMemo`, esse `reduce` rodaria em todo render do componente, mesmo quando `orders` não mudou.

**`useCallback` — memoiza uma função**

Retorna a mesma referência de função entre renders, desde que as dependências não mudem.

```jsx
const handleSubmit = useCallback((data) => {
  saveUser(data)
}, [saveUser])
```

Sem `useCallback`, uma nova função seria criada a cada render — o que quebra comparações por referência.

**Por que referência importa**

Em JavaScript, funções e objetos são comparados por referência, não por valor:

```js
() => {} === () => {} // false — são objetos diferentes na memória
```

Isso importa em dois cenários:
1. A função é passada como prop para um componente filho envolvido em `React.memo`
2. A função é uma dependência de outro hook (`useEffect`, `useMemo`)

**O caso de uso clássico: `React.memo` + `useCallback`**

```jsx
const Button = React.memo(({ onClick, label }) => {
  console.log('renderizou')
  return <button onClick={onClick}>{label}</button>
})

function Form() {
  const [count, setCount] = useState(0)

  // Sem useCallback: nova referência a cada render → Button sempre re-renderiza
  // Com useCallback: mesma referência → Button só re-renderiza se a dep mudar
  const handleClick = useCallback(() => {
    console.log('clicou')
  }, [])

  return (
    <>
      <Button onClick={handleClick} label="Salvar" />
      <button onClick={() => setCount(c => c + 1)}>+{count}</button>
    </>
  )
}
```

**Quando usar**

| Hook | Use quando... |
|------|--------------|
| `useMemo` | Cálculo é custoso (ordenação, filtro em lista grande, transformação complexa) |
| `useMemo` | Valor é dependência de outro hook e precisa de referência estável |
| `useCallback` | Função é passada para componente filho com `React.memo` |
| `useCallback` | Função é dependência de `useEffect` ou `useMemo` |

**Quando NÃO usar**

A memoização tem custo: memória para guardar o valor anterior e tempo para comparar dependências. Para cálculos triviais, o overhead da memoização é maior que o benefício.

Não use para:
- Operações simples (`a + b`, acesso a propriedade)
- Componentes que re-renderizam de qualquer forma (sem `React.memo`)
- Funções que nunca são passadas adiante

> A regra prática: meça antes de otimizar. `useMemo` e `useCallback` são para problemas de performance confirmados, não prevenção prematura.

## Quick Answer

`useMemo` memoiza o resultado de um cálculo; `useCallback` memoiza a referência de uma função. Ambos evitam retrabalho entre renders quando as dependências não mudam. Use `useMemo` para cálculos custosos e `useCallback` para funções passadas a componentes com `React.memo` ou usadas como dependência de outros hooks. Evite usá-los por padrão — têm custo de memória e só valem quando há problema real de performance.

## Flashcard

**P:** Qual a diferença entre `useMemo` e `useCallback`, e quando usar cada um?

**R:** `useMemo` memoiza um **valor** (resultado de cálculo). `useCallback` memoiza uma **função** (sua referência). Use `useMemo` para cálculos custosos; use `useCallback` quando a função é prop de um filho com `React.memo` ou dependência de outro hook. Ambos são otimização — não use por padrão.

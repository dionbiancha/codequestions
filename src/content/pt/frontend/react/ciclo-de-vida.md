---
title: "Explique o ciclo de vida do React"
category: frontend
subcategory: react
tags: [lifecycle, useEffect, hooks, montagem, desmontagem]
difficulty: pleno
lang: pt
---

## Full Answer

Entender o ciclo de vida é crucial para performance e controle de efeitos colaterais. No React moderno (com Hooks), não pensamos mais tanto em "métodos de classe", mas sim na **sincronização do componente com o estado e o DOM**.

### As Três Fases Principais

### A. Montagem (Mounting)

É quando o componente nasce. Ele é transformado de código JavaScript em nós reais no DOM do navegador.

- **No passado:** Usava-se o `componentDidMount`.
- **Hoje (Hooks):** Usamos o `useEffect` com um array de dependências vazio `[]`. É o momento ideal para chamadas de API ou configurar timers.

### B. Atualização (Updating)

Ocorre sempre que há uma mudança nas **Props** ou no **Estado**. O React precisa decidir se a interface deve mudar.

- **No passado:** Usava-se `componentDidUpdate`.
- **Hoje (Hooks):** Usamos o `useEffect` passando variáveis no array de dependências `[estado]`. O efeito roda sempre que aquela variável mudar.

### C. Desmontagem (Unmounting)

É quando o componente é removido do DOM (ex: o usuário trocou de página ou fechou um modal).

- **No passado:** Usava-se `componentWillUnmount`.
- **Hoje (Hooks):** Usamos a **função de limpeza (cleanup)** dentro do `useEffect`. É essencial para evitar "vazamentos de memória" (memory leaks), como limpar intervalos ou cancelar inscrições de eventos.

### Exemplo Prático com useEffect

```tsx
import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // FASE DE MONTAGEM: O componente iniciou
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // FASE DE DESMONTAGEM: A função de limpeza (Cleanup)
    // Roda quando o componente sai da tela
    return () => {
      clearInterval(interval);
      console.log("Timer limpo para evitar memory leak.");
    };
  }, []); // Array vazio = Roda apenas na montagem

  return <div>Tempo decorrido: {seconds}s</div>;
};
```

## Quick Answer

O ciclo de vida de um componente React tem 3 fases: **Montagem** (`useEffect(() => {}, [])`), **Atualização** (`useEffect(() => {}, [dep])`) e **Desmontagem** (função de retorno dentro do `useEffect`). A fase de desmontagem é essencial para limpar timers e event listeners e evitar memory leaks.

## Flashcard

**P:** Quais as 3 principais fases do ciclo de vida de um componente React e como representá-las com Hooks?

**R:**
1. **Montagem:** `useEffect(() => {}, [])` — Quando o componente entra no DOM.
2. **Atualização:** `useEffect(() => {}, [dep])` — Quando props ou estados mudam.
3. **Desmontagem:** `return () => {}` (dentro do useEffect) — Para limpar recursos antes do componente ser destruído.

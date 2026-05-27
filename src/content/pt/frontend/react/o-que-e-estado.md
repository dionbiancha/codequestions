---
title: "O que é estado no React?"
category: frontend
subcategory: react
tags: [state, hooks, useState, re-render]
difficulty: beginner
lang: pt
---

## Full Answer

O Estado é um objeto JavaScript gerenciado dentro de um componente que armazena dados que podem mudar ao longo do tempo. A grande diferença para as variáveis comuns é que, **sempre que o estado muda, o React re-renderiza o componente** automaticamente para refletir essa mudança na interface (UI).

### Diferenças Cruciais

- **Local e Privado:** Diferente das Props, o estado é totalmente controlado e privado ao componente que o define.
- **Assíncrono:** As atualizações de estado no React não são imediatas; o React as agrupa para otimizar a performance.
- **Interatividade:** É através do estado que lidamos com inputs de formulários, contadores, dados buscados de uma API ou alternância de temas (dark/light mode).

### Exemplo Prático com Hooks

Em componentes funcionais, utilizamos o Hook `useState` para gerenciar o estado:

```tsx
import React, { useState } from 'react';

const FinanceCounter: React.FC = () => {
  // Definindo o estado 'saldo' iniciando em 0
  // setSaldo é a função que usaremos para atualizar o valor
  const [saldo, setSaldo] = useState<number>(0);

  return (
    <div>
      <h2>Saldo Atual: R$ {saldo}</h2>
      <button onClick={() => setSaldo(saldo + 100)}>
        Adicionar R$ 100
      </button>
      <button onClick={() => setSaldo(0)}>
        Zerar Saldo
      </button>
    </div>
  );
};
```

Nesse exemplo, se você apenas alterasse uma variável comum (`let saldo = 0`), o React não saberia que precisa atualizar a tela. Ao usar `setSaldo`, o React detecta a mudança, compara o Virtual DOM e atualiza apenas o valor exibido.

## Quick Answer

Estado é um objeto que armazena dados internos de um componente que podem mudar com o tempo. Sempre que o estado é atualizado via `useState`, o React **re-renderiza** o componente automaticamente para refletir a mudança na UI.

## Flashcard

**P:** O que é o Estado (State) no React e qual seu efeito colateral principal?

**R:** É um objeto que armazena dados internos de um componente que podem mudar com o tempo. Seu principal efeito colateral é disparar uma **re-renderização** do componente sempre que o seu valor é atualizado.

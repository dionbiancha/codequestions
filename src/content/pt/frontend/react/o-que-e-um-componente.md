---
title: "O que é um componente no React?"
category: frontend
subcategory: react
tags: [componente, props, JSX, functional-components]
difficulty: junior
lang: pt
---

## Full Answer

Um componente é, essencialmente, uma **função JavaScript** (ou classe, embora funções sejam o padrão atual) que retorna elementos de interface (UI). Ele encapsula três pilares principais:

1. **Lógica:** Manipulação de dados e estados (Hooks).
2. **Estrutura:** O que será renderizado (JSX).
3. **Estilo:** Como ele deve parecer (CSS, Styled Components, etc).

**Características Principais:**

- **Composição:** Você constrói componentes pequenos (botão, input) e os combina para formar componentes complexos (formulário, dashboard).
- **Reutilização:** Um mesmo componente pode ser utilizado em diferentes partes da aplicação com comportamentos ou dados distintos.
- **Isolamento:** Cada componente gerencia seu próprio ciclo de vida e estado, o que facilita o debug e a manutenção.

```tsx
interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <div className="card">
      <h1>Olá, {name}!</h1>
      <p>Bem-vindo ao sistema.</p>
    </div>
  );
};

export default Welcome;
```

O componente `Welcome` é puro: recebe uma entrada (`props`) e retorna uma representação visual. Se o `name` mudar, o React atualiza apenas essa parte do DOM de forma eficiente.

## Quick Answer

Um componente React é uma função JavaScript que retorna JSX. Ele encapsula lógica, estrutura e estilo em uma unidade reutilizável, modular e isolada — permitindo compor interfaces complexas a partir de partes menores.

## Flashcard

**P:** O que é um componente no React e qual sua principal função?

**R:** É uma unidade lógica e visual independente (geralmente uma função JS) que retorna JSX. Sua principal função é permitir a criação de interfaces modulares, reutilizáveis e fáceis de manter, dividindo a UI em partes menores e isoladas.

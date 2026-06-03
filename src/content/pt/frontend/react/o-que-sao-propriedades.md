---
title: "O que são propriedades no React?"
category: frontend
subcategory: react
tags: [props, typescript, componentes, imutabilidade]
difficulty: junior
lang: pt
---

## Full Answer

As props são argumentos que passamos para os componentes React, de forma muito similar aos argumentos de uma função JavaScript. Elas são **somente leitura (read-only)**, o que significa que um componente filho nunca deve modificar as props que recebe; ele apenas as consome para renderizar a interface ou definir comportamentos.

### Características Fundamentais

- **Fluxo Unidirecional:** Os dados viajam do componente pai (parent) para o componente filho (child).
- **Imutabilidade:** O componente que recebe a prop não pode alterá-la. Se o dado precisar mudar, o componente pai deve gerenciar um estado e passar a nova versão ou uma função de callback.
- **Tipagem:** Em projetos profissionais com TypeScript, usamos interfaces para garantir que o componente receba exatamente o que espera, evitando erros em tempo de execução.

### Exemplo Prático

Imagine um componente de botão customizado que pode ter diferentes textos e cores:

```tsx
import React from 'react';

// Definindo o "contrato" das propriedades
interface ButtonProps {
  label: string;
  color?: string; // Propriedade opcional
  onClick: () => void; // Passando uma função como prop
}

const CustomButton: React.FC<ButtonProps> = ({ label, color = 'blue', onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color, color: 'white', padding: '10px' }}
    >
      {label}
    </button>
  );
};

// Uso no componente Pai:
// <CustomButton label="Salvar Dados" onClick={() => console.log('Clicou!')} />
```

Neste exemplo, o `CustomButton` é genérico. Ele não sabe o que o botão faz ou qual texto exibe até que o componente pai forneça essas informações via props.

## Quick Answer

Props são argumentos passados de um componente pai para um filho para configurar seu conteúdo ou comportamento. São **somente leitura** — o componente filho nunca as modifica, apenas as consome.

## Flashcard

**P:** O que são Props no React e qual sua principal restrição?

**R:** São argumentos passados de um componente pai para um filho para configurar seu conteúdo ou comportamento. Sua principal restrição é a **imutabilidade**: as props são "somente leitura" para o componente que as recebe.

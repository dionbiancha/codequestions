---
title: "Como você abordaria a acessibilidade ao construir uma aplicação?"
category: frontend
subcategory: accessibility
tags: [acessibilidade, a11y, aria, wcag, html-semantico]
difficulty: pleno
lang: pt
---

## Full Answer

Acessibilidade (a11y) é a prática de construir interfaces utilizáveis por qualquer pessoa, incluindo quem usa leitores de tela, navega apenas pelo teclado ou tem baixa visão. A abordagem começa na base e avança em camadas:

### 1. HTML Semântico

Use as tags corretas para cada propósito. O browser e os leitores de tela entendem a semântica nativamente — sem nenhum atributo extra necessário.

```html
<!-- Ruim -->
<div class="btn" onclick="salvar()">Salvar</div>

<!-- Bom -->
<button type="button" onclick="salvar()">Salvar</button>
```

Tags como `<nav>`, `<main>`, `<header>`, `<section>`, `<article>` e `<aside>` criam landmarks que permitem que usuários de leitores de tela naveguem rapidamente pela página.

### 2. ARIA somente quando necessário

ARIA (Accessible Rich Internet Applications) adiciona semântica onde o HTML não é suficiente, como em componentes customizados.

```html
<!-- Dropdown customizado -->
<button aria-haspopup="listbox" aria-expanded="false" aria-controls="opcoes">
  Selecionar idioma
</button>
<ul id="opcoes" role="listbox" aria-label="Idiomas disponíveis">
  <li role="option" aria-selected="true">Português</li>
  <li role="option" aria-selected="false">English</li>
</ul>
```

**Regra de ouro:** HTML semântico nativo sempre supera ARIA. Use ARIA para preencher lacunas, não para sobrescrever semântica existente.

### 3. Contraste e cores

O padrão WCAG AA exige:
- **4,5:1** para texto normal
- **3:1** para texto grande (18pt+ ou 14pt negrito)
- Nunca dependa apenas da cor para transmitir informação — use ícones, padrões ou rótulos

### 4. Navegação por teclado

Todos os elementos interativos devem ser alcançáveis e operáveis via teclado:

```css
/* Nunca remova o outline sem substituir */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

Gerencie o foco ativamente em modais e drawers: quando abre, mova o foco para dentro; quando fecha, devolva ao elemento que o abriu.

### 5. Textos alternativos

```html
<!-- Imagem informativa -->
<img src="grafico.png" alt="Crescimento de 32% nas vendas em 2024" />

<!-- Imagem decorativa -->
<img src="separador.png" alt="" role="presentation" />
```

### 6. Formulários acessíveis

```html
<label for="email">E-mail</label>
<input id="email" type="email" aria-describedby="email-dica" required />
<span id="email-dica">Use seu e-mail corporativo</span>
```

### 7. Testes

| Ferramenta | O que verifica |
|---|---|
| [axe DevTools](https://www.deque.com/axe/) | Erros automáticos de WCAG no browser |
| Lighthouse (DevTools) | Score de acessibilidade + sugestões |
| Leitor de tela (NVDA, VoiceOver) | Experiência real do usuário |
| Teclado puro | Fluxo de navegação sem mouse |

A automação encontra ~30–40% dos problemas; o restante exige teste manual.

## Quick Answer

Começo pelo HTML semântico correto, garanto contraste adequado e navegação completa por teclado, e uso ARIA apenas onde o HTML nativo não é suficiente. Durante o desenvolvimento, rodo ferramentas como axe e Lighthouse, complementando com testes manuais usando leitor de tela e navegação só pelo teclado para cobrir o que a automação não detecta.

## Flashcard

**P:** Quais são os pilares da acessibilidade em uma aplicação web?

**R:** HTML semântico nativo, contraste de cores (WCAG AA: 4,5:1), navegação por teclado com foco visível, ARIA apenas onde necessário, textos alternativos em imagens e formulários com labels explícitos. Validar com axe/Lighthouse + testes manuais com leitor de tela.

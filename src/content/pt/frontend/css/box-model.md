---
title: "O que é o Box Model do CSS?"
category: frontend
subcategory: css
tags: [css, box-model, layout, margin, padding]
difficulty: beginner
lang: pt
---

## Full Answer

O Box Model do CSS descreve como todo elemento HTML é renderizado como uma caixa retangular composta por quatro camadas, de dentro para fora:

1. **Content (Conteúdo)** — o texto, imagem ou outro conteúdo real. `width` e `height` se aplicam aqui por padrão.
2. **Padding** — espaço transparente entre o conteúdo e a borda. Fica dentro do elemento, então herda a cor de fundo.
3. **Border (Borda)** — uma linha ao redor do padding e conteúdo. Pode ter largura, estilo e cor.
4. **Margin (Margem)** — espaço transparente fora da borda. Margens de elementos adjacentes podem colapsar (margin collapsing).

**Box Sizing**

Por padrão (`box-sizing: content-box`), `width` e `height` se aplicam apenas à área de conteúdo — padding e border são somados por cima, fazendo o elemento renderizado ser maior do que o especificado.

Com `box-sizing: border-box`, `width` e `height` incluem padding e border. Isso é quase sempre mais intuitivo e é o padrão na maioria dos CSS resets:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

**Exemplo:**

```css
.caixa {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
/* content-box: largura renderizada = 200 + 40 + 4 = 244px */
/* border-box:  largura renderizada = 200px (padding e border cabem dentro) */
```

## Quick Answer

O Box Model são as quatro camadas ao redor de todo elemento: conteúdo, padding, border, margin. Por padrão `width` define apenas a área de conteúdo; com `box-sizing: border-box` inclui padding e border — quase sempre preferível.

## Flashcard

**P:** Quais são as quatro camadas do Box Model do CSS, de dentro para fora?

**R:** Conteúdo → Padding → Border → Margin. Com `box-sizing: border-box`, `width`/`height` incluem padding e border; com `content-box` (padrão) cobrem apenas o conteúdo.

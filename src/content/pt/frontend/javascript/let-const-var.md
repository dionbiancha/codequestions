---
title: "Qual é a diferença entre let, const e var?"
category: frontend
subcategory: javascript
tags: [es6, escopo, hoisting, variaveis]
difficulty: beginner
lang: pt
---

## Full Answer

JavaScript tem três formas de declarar variáveis: `var`, `let` e `const`. Elas diferem em escopo, comportamento de hoisting e mutabilidade.

**var**
- Escopo de função (ou escopo global se declarada fora de uma função)
- Sofre hoisting para o topo do seu escopo e é inicializada como `undefined`
- Pode ser redeclarada e reatribuída

**let**
- Escopo de bloco (limitado ao bloco `{}` em que foi declarada)
- Sofre hoisting mas NÃO é inicializada — acessá-la antes da declaração lança `ReferenceError` (Temporal Dead Zone)
- Não pode ser redeclarada no mesmo escopo, mas pode ser reatribuída

**const**
- Escopo de bloco, igual ao `let`
- Não pode ser redeclarada nem reatribuída — o vínculo é constante
- Objetos e arrays declarados com `const` ainda são mutáveis

**Regra geral:** prefira `const` por padrão, use `let` quando precisar reatribuir, evite `var`.

## Quick Answer

`var` tem escopo de função e sofre hoisting como `undefined`; `let` e `const` têm escopo de bloco com Temporal Dead Zone. `const` impede reatribuição; `let` permite. Prefira `const` por padrão.

## Flashcard

**P:** Quais são as três diferenças principais entre `var`, `let` e `const`?

**R:** 1) Escopo — `var` é de função, `let`/`const` são de bloco. 2) Hoisting — `var` inicializa como `undefined`, `let`/`const` entram na Temporal Dead Zone. 3) Reatribuição — `const` proíbe, `let` e `var` permitem.

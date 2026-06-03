---
title: "What is the difference between let, const, and var?"
category: frontend
subcategory: javascript
tags: [es6, scope, hoisting, variables]
difficulty: junior
lang: en
---

## Full Answer

JavaScript has three ways to declare variables: `var`, `let`, and `const`. They differ in scope, hoisting behavior, and mutability.

**var**
- Function-scoped (or globally scoped if declared outside a function)
- Hoisted to the top of its scope and initialized as `undefined`
- Can be redeclared and reassigned

**let**
- Block-scoped (limited to the `{}` block it is declared in)
- Hoisted but NOT initialized — accessing it before declaration throws a `ReferenceError` (Temporal Dead Zone)
- Cannot be redeclared in the same scope, but can be reassigned

**const**
- Block-scoped, same as `let`
- Cannot be redeclared or reassigned — the binding is constant
- Objects and arrays declared with `const` are still mutable (their contents can change)

**Rule of thumb:** prefer `const` by default, use `let` when you need to reassign, avoid `var`.

## Quick Answer

`var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped with a Temporal Dead Zone. `const` prevents reassignment; `let` allows it. Prefer `const` by default.

## Flashcard

**Q:** What are the three key differences between `var`, `let`, and `const`?

**A:** 1) Scope — `var` is function-scoped, `let`/`const` are block-scoped. 2) Hoisting — `var` initializes as `undefined`, `let`/`const` enter the Temporal Dead Zone. 3) Reassignment — `const` forbids it, `let` and `var` allow it.

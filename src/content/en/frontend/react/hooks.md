---
title: "What are React Hooks and why were they introduced?"
category: frontend
subcategory: react
tags: [hooks, useState, useEffect, functional-components]
difficulty: beginner
lang: en
---

## Full Answer

React Hooks are functions that let you use React state and lifecycle features inside **functional components**, without writing a class component.

Introduced in React 16.8, they solve three main problems with class components:

1. **Reusing stateful logic** — before Hooks, sharing stateful logic required patterns like render props or HOCs. Hooks let you extract stateful logic into a custom Hook and reuse it directly.

2. **Complex components** — lifecycle methods like `componentDidMount` forced unrelated logic to live together. `useEffect` lets you co-locate related side effects.

3. **Classes are confusing** — `this` binding and event handler binding created a learning curve. Hooks eliminate all of that.

**Core Hooks:** `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`

**Rules of Hooks:**
1. Only call Hooks at the top level
2. Only call Hooks from React functions

## Quick Answer

Hooks let functional components use state and lifecycle features previously only available in class components. Introduced in React 16.8 to simplify code reuse, co-locate related logic, and eliminate class complexity.

## Flashcard

**Q:** What problem did React Hooks solve?

**A:** They let functional components use state and lifecycle features without classes, solving three issues: (1) difficulty reusing stateful logic, (2) unrelated code mixed in lifecycle methods, (3) `this` binding confusion in classes.

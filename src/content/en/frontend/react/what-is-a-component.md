---
title: "What is a component in React?"
category: frontend
subcategory: react
tags: [component, props, JSX, functional-components]
difficulty: junior
lang: en
---

## Full Answer

A component is essentially a **JavaScript function** (or class, though functions are the current standard) that returns UI elements. It encapsulates three main pillars:

1. **Logic:** Data and state management (Hooks).
2. **Structure:** What will be rendered (JSX).
3. **Style:** How it should look (CSS, Styled Components, etc).

**Key characteristics:**

- **Composition:** You build small components (button, input) and combine them to form complex components (form, dashboard).
- **Reusability:** The same component can be used in different parts of the application with different behaviors or data.
- **Isolation:** Each component manages its own lifecycle and state, making debugging and maintenance easier.

```tsx
interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      <p>Welcome to the system.</p>
    </div>
  );
};

export default Welcome;
```

The `Welcome` component is pure: it receives an input (`props`) and returns a visual representation. If `name` changes, React updates only that part of the DOM efficiently.

## Quick Answer

A React component is a JavaScript function that returns JSX. It encapsulates logic, structure, and style in a reusable, modular, and isolated unit — enabling you to compose complex interfaces from smaller parts.

## Flashcard

**Q:** What is a component in React and what is its main purpose?

**A:** An independent logical and visual unit (usually a JS function) that returns JSX. Its main purpose is to enable building modular, reusable, and maintainable interfaces by dividing the UI into smaller, isolated parts.

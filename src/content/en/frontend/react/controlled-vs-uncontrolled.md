---
title: "What is the difference between controlled and uncontrolled components in React?"
category: frontend
subcategory: react
tags: [react, forms, controlled, uncontrolled, state]
difficulty: pleno
lang: en
---

## Full Answer

In React, **controlled** and **uncontrolled** components differ in where the source of truth for form data lives.

**Controlled components**

The component's value is driven by React state. Every keystroke triggers an event handler that calls `setState`, and the input's `value` prop is set from state. React owns the data.

```jsx
function ControlledInput() {
  const [name, setName] = useState('')
  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
  )
}
```

Advantages:
- Instant access to the current value
- Easy to validate, transform, or disable inputs on every change
- Single source of truth — predictable behavior

**Uncontrolled components**

The DOM owns the value. React does not track changes. You read the value only when needed, using a `ref`.

```jsx
function UncontrolledInput() {
  const inputRef = useRef(null)

  function handleSubmit() {
    console.log(inputRef.current.value)
  }

  return <input ref={inputRef} defaultValue="initial" />
}
```

Advantages:
- Less boilerplate for simple cases
- Better for integrating with non-React code or file inputs
- Slightly better performance for very large forms (no re-render on every keystroke)

**When to use which:**
- Default to controlled for most forms — they are predictable and easy to test.
- Use uncontrolled when integrating third-party DOM libraries or handling file inputs (`<input type="file">` cannot be controlled).

## Quick Answer

Controlled components store form data in React state and update it on every change via `onChange`. Uncontrolled components let the DOM manage the value and you read it via a `ref` when needed. Prefer controlled for most cases.

## Flashcard

**Q:** What is the key difference between a controlled and uncontrolled component in React?

**A:** Controlled: React state is the source of truth, value is set via props, changes go through `onChange`. Uncontrolled: the DOM manages the value, accessed via `ref` only when needed.

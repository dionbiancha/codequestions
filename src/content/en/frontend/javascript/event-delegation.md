---
title: "What is event delegation?"
category: frontend
subcategory: javascript
tags: [dom, events, performance, bubbling]
difficulty: pleno
lang: en
---

## Full Answer

Event delegation is a pattern where a single event listener is placed on a **parent element** to handle events triggered by its **child elements**, instead of attaching individual listeners to each child.

It works because of **event bubbling**: when an event fires on a child, it bubbles up through the DOM to parent elements. The parent listener can inspect `event.target` to determine which child triggered the event.

**Benefits:**
- Fewer event listeners → less memory usage
- Works for dynamically added children (no need to reattach listeners)
- Simpler cleanup (remove one listener instead of many)

**When not to use it:** events that don't bubble (e.g., `focus`, `blur`) require `focusin`/`focusout` instead, or `addEventListener` with `useCapture: true`.

## Quick Answer

Event delegation attaches one listener to a parent element that handles events from its children via bubbling, checking `event.target` to identify the source. It reduces memory usage and works for dynamically added elements.

## Flashcard

**Q:** What is event delegation and why is it useful?

**A:** Placing a single event listener on a parent to handle events from children via bubbling. Useful because it reduces listener count, saves memory, and automatically handles dynamically added children.

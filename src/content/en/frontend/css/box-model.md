---
title: "What is the CSS Box Model?"
category: frontend
subcategory: css
tags: [css, box-model, layout, margin, padding]
difficulty: junior
lang: en
---

## Full Answer

The CSS Box Model describes how every HTML element is rendered as a rectangular box composed of four layers, from inside out:

1. **Content** — the actual text, image, or other content. Width and height apply here by default.
2. **Padding** — transparent space between the content and the border. Padding is inside the element, so it inherits the element's background color.
3. **Border** — a line wrapping the padding and content. Can have width, style, and color.
4. **Margin** — transparent space outside the border. Margins of adjacent elements can collapse into each other (margin collapsing).

**Box Sizing**

By default (`box-sizing: content-box`), `width` and `height` only apply to the content box — padding and border are added on top, making the actual rendered size larger than you specified.

With `box-sizing: border-box`, `width` and `height` include padding and border. This is almost always more intuitive and is used by default in most CSS resets:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

**Example:**

```css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
/* content-box: rendered width = 200 + 40 + 4 = 244px */
/* border-box:  rendered width = 200px (padding and border fit inside) */
```

## Quick Answer

The Box Model is the four layers around every element: content, padding, border, margin. By default `width` only sets the content area; with `box-sizing: border-box` it includes padding and border, which is almost always preferred.

## Flashcard

**Q:** What are the four layers of the CSS Box Model, from inside out?

**A:** Content → Padding → Border → Margin. With `box-sizing: border-box`, `width`/`height` include padding and border; with `content-box` (default) they only cover content.

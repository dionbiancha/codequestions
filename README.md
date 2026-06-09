# codequestions

> Open-source interview prep portal for developers. Curated questions, complete answers, flashcards, and progress tracking — no login required.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)](https://codequestions.vercel.app)

---

## Features

- **Curated questions** organized by category (Frontend, Backend, DevOps, Data, Architecture, Security, Soft Skills)
- **Split-view layout** — full study answer on the left, quick interviewer answer + flashcard on the right
- **3D flip flashcards** with "Got it / Need more study" buttons
- **Progress tracking** stored in `localStorage` — no account needed
- **Dark / light theme** toggle, dark by default
- **Bilingual** — English and Portuguese, auto-detected from browser language
- **Fully static** — no database, no backend, deploys to Vercel free tier
- **Markdown-based content** — contribute a question by editing a `.md` file and opening a PR

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content | gray-matter + remark + remark-html |
| i18n | next-intl |
| Progress | localStorage |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/dionbiancha/codequestions.git
cd codequestions
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # run tests
npm run build     # production build
```

---

## Adding Questions (Contributing)

All content lives in `.md` files. Contributing is as simple as adding a file and opening a Pull Request — no code changes required.

### 1. Fork and create a branch

```bash
git checkout -b add/frontend-javascript-closures
```

### 2. Create the file

Place the file under `src/content/<locale>/<category>/<subcategory>/<slug>.md`:

```
src/content/
  en/
    frontend/
      javascript/
        closures.md       ← your new file
      react/
    backend/
      node/
    soft-skills/
  pt/
    frontend/
      javascript/
        closures.md       ← optional Portuguese translation
```

### 3. Write the frontmatter

```yaml
---
title: "What is a closure in JavaScript?"
category: frontend
subcategory: javascript
tags: [closures, scope, functions]
difficulty: junior   # junior | pleno | senior | especialista
lang: en
---
```

| Field | Required | Values |
|---|---|---|
| `title` | yes | Full question text |
| `category` | yes | `frontend` `backend` `devops` `data` `soft-skills` `architecture` `security` |
| `subcategory` | yes | e.g. `javascript`, `react`, `node`, `docker` |
| `tags` | yes | Array of relevant keywords |
| `difficulty` | yes | `junior` `pleno` `senior` `especialista` |
| `lang` | yes | `en` or `pt` |

**Difficulty levels:**

| Value | Description |
|---|---|
| `junior` | Entry-level concept — up to 2 years of experience |
| `pleno` | Intermediate concept — mid-level developers |
| `senior` | Advanced concept — broad experience or deep specialization |
| `especialista` | Expert-level — niche, architectural, or low-level knowledge |

### 4. Write the three required sections

```markdown
## Full Answer

Complete explanation for deep study. Use code blocks, lists, and examples freely.

## Quick Answer

One or two sentences suitable for saying out loud to an interviewer.

## Flashcard

**Q:** The question restated concisely.

**A:** A short answer that fits on the back of a card.
```

### 5. Open a Pull Request

- Target the `main` branch
- Title format: `feat: add <category>/<subcategory>/<slug>`
- A PR with only one language is accepted — bilingual is welcome but not required
- CI validates the frontmatter schema automatically

---

## Categories

| Slug | Display Name |
|---|---|
| `frontend` | Frontend |
| `backend` | Backend |
| `devops` | DevOps |
| `data` | Data |
| `soft-skills` | Soft Skills |
| `architecture` | Software Architecture |
| `security` | Security |

---

## Project Structure

```
src/
  app/
    [locale]/
      page.tsx                  home
      questions/
        page.tsx                category hub
        [category]/
          page.tsx              question list
          [slug]/page.tsx       question detail (split view)
      storytelling/page.tsx
      contribute/page.tsx
  components/
    layout/
      Header.tsx                nav + locale switcher + theme toggle
      Footer.tsx
    questions/
      CategoryCard.tsx
      QuestionCard.tsx
      QuestionSplitView.tsx     split view wrapper
      FlashCard.tsx             3D flip card
      ProgressBadge.tsx
    ui/
      Badge.tsx
      Button.tsx
      MarkdownRenderer.tsx
  lib/
    content.ts                  reads and parses .md files
    progress.ts                 localStorage helpers
    categories.ts               category metadata
  content/
    en/                         English questions
    pt/                         Portuguese questions
  messages/
    en.json                     UI strings (English)
    pt.json                     UI strings (Portuguese)
```

---

## Content Guidelines

- Answers should be accurate and concise — avoid padding
- Code blocks must specify a language (` ```js `, ` ```bash `, etc.)
- Quick Answer should be speakable in under 20 seconds
- Flashcard front and back should make sense independently (no "see above")
- Avoid duplicating existing questions — check the category page first

---

## License

MIT — see [LICENSE](LICENSE).

---

Made with ❤️ for developers. [Open an issue](https://github.com/dionbiancha/codequestions/issues) to suggest a question or report a problem.

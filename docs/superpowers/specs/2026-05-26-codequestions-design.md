# CodeQuestions — Design Spec
**Date:** 2026-05-26  
**Status:** Approved

---

## Overview

CodeQuestions is an open-source interview preparation portal for IT professionals. It provides a curated, community-driven list of the most frequently asked interview questions, organized by area and role. Each question includes a complete study answer, a brief interviewer-focused answer, and an interactive flashcard. The portal also includes a StoryTelling guide for non-technical HR interviews.

All content lives in `.md` files in the repository — contributions happen via GitHub Pull Requests, keeping the workflow familiar to developers.

---

## Goals

- Help developers prepare for technical interviews efficiently
- Make contribution dead-simple (edit a markdown file, open a PR)
- Be fully international (English + Portuguese) from day one
- Work without any backend, login, or database
- Support dark and light themes, dark as default

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (`darkMode: 'class'`) |
| Content parsing | gray-matter + remark + remark-html |
| i18n | next-intl |
| Progress storage | localStorage (no auth) |
| Deployment | Vercel (free tier) |

---

## Visual Design

- **Style:** Developer Dark — GitHub-inspired (`#0d1117` background, `#161b22` surfaces, `#30363d` borders, `#58a6ff` blue accents, `#3fb950` green accents)
- **Light mode palette:** `#ffffff` background, `#f6f8fa` surfaces, `#d0d7de` borders
- **Theme toggle:** persisted in localStorage, accessible from the Header on all pages
- **Dark is the default** — applied via `class="dark"` on `<html>`
- **Typography:** monospace accents for code snippets and category labels; system sans-serif for body text

---

## Internationalization (i18n)

- **Library:** next-intl with App Router middleware
- **Supported locales:** `en` (English), `pt` (Portuguese)
- **Default locale:** `en` — served at `/questions/...` without prefix
- **Portuguese:** served at `/pt/questions/...`
- **Auto-detection:** Browser language detected via middleware; `pt-BR` and `pt` redirect to `/pt/...` automatically; all other languages fall back to `en`
- **UI strings:** `messages/en.json` and `messages/pt.json`
- **Content:** Separate `.md` files under `content/en/` and `content/pt/` — a question can exist in one language only; parity is not required for PR acceptance

---

## Content Format

Questions are `.md` files with YAML frontmatter:

```
content/
  en/
    frontend/
      javascript/
        event-delegation.md
      react/
        hooks.md
    backend/
      node/
        event-loop.md
    soft-skills/
      storytelling.md
  pt/
    frontend/
      javascript/
        event-delegation.md
    ...
```

**Frontmatter schema:**
```yaml
---
title: "What is event delegation?"
category: frontend         # frontend | backend | devops | data | soft-skills | architecture | security
subcategory: javascript
tags: [dom, events, performance]
difficulty: beginner | intermediate | advanced
lang: en
---
```

**File body sections** (h2 headings, parsed by the app):
```markdown
## Full Answer
Complete explanation for deep study...

## Quick Answer
One or two sentences for the interviewer.

## Flashcard
Question front / answer back formatted for the flip card.

## Mind Map
Optional: Mermaid diagram or image reference.
```

---

## Pages & Routes

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | How the portal works, call to contribute, language auto-redirect |
| `/[locale]/questions` | Category Hub | Cards for each category with progress badge |
| `/[locale]/questions/[category]` | Question List | All questions in a category, with status icons |
| `/[locale]/questions/[category]/[slug]` | Question Detail | Split view layout |
| `/[locale]/storytelling` | StoryTelling Guide | How to build a narrative for HR interviews |
| `/[locale]/faq` | FAQ | Frequently asked questions about the portal |
| `/[locale]/about` | About | Project origin, maintainers, mission |
| `/[locale]/contribute` | Contribution Guide | Step-by-step how to add questions via PR |
| `/[locale]/contact` | Contact | Email address + link to open a GitHub issue |
| `/[locale]/support` | Support | Pix / GitHub Sponsors / Ko-fi |

---

## Categories (MVP)

| Slug | Display Name |
|------|-------------|
| `frontend` | Frontend |
| `backend` | Backend |
| `devops` | DevOps |
| `data` | Data |
| `soft-skills` | Soft Skills |
| `architecture` | Software Architecture |
| `security` | Security |

---

## Question Detail Page — Split View Layout

```
┌─────────────────────────────┬──────────────────┐
│                             │  Quick Answer    │
│       Full Answer           │  ─────────────  │
│   (markdown rendered)       │  Flashcard       │
│                             │  (flip card)     │
└─────────────────────────────┴──────────────────┘
```

- **Left panel (2/3 width):** Full answer rendered from markdown, with syntax highlighting for code blocks
- **Right panel (1/3 width):** Quick Answer card + Flip Card below it
- **Mobile:** Stacks vertically — Full Answer → Quick Answer → Flip Card
- **Flip Card:** Front shows the question, click/tap flips to reveal the answer with CSS 3D transform animation. After reveal, two buttons appear: "Got it ✓" (green) and "Need more study ↺" (orange)

---

## Flashcard (Flip Card)

- CSS 3D `rotateY` flip animation on click
- **Front face:** Question text + "Click to flip" hint
- **Back face:** Brief answer + two action buttons:
  - `Got it` → saves `"known"` to localStorage
  - `Need more study` → saves `"review"` to localStorage
- State persisted per question slug in localStorage

---

## User Progress (localStorage)

No login required. All progress stored client-side.

**Storage key:** `cq_progress`

**Structure:**
```json
{
  "frontend/javascript/event-delegation": "known",
  "frontend/react/hooks": "review"
}
```

**Status values:** `"known"` | `"review"` | (absent = not seen)

**UI integration:**
- Category Hub cards show a progress badge: `12/42`
- Question list items show a status icon: ✓ (green) · ↺ (orange) · nothing (not seen)
- `/[locale]/questions` hub shows overall progress per category
- Settings/footer link: "Reset my progress" clears localStorage key

---

## Component Structure

```
src/
  app/
    layout.tsx                    ← root layout (theme class on <html>)
    [locale]/
      layout.tsx                  ← next-intl provider + locale
      page.tsx                    ← home
      questions/
        page.tsx                  ← category hub
        [category]/
          page.tsx                ← question list
          [slug]/
            page.tsx              ← question detail (split view)
      storytelling/page.tsx
      faq/page.tsx
      about/page.tsx
      contribute/page.tsx
      contact/page.tsx
      support/page.tsx
  components/
    layout/
      Header.tsx                  ← nav + locale switcher + theme toggle
      Footer.tsx
    questions/
      CategoryCard.tsx            ← hub card with progress badge
      QuestionCard.tsx            ← list item with status icon
      QuestionSplitView.tsx       ← split view wrapper
      FlashCard.tsx               ← 3D flip card with got-it/review buttons
      ProgressBadge.tsx           ← "12/42" badge
    ui/
      Badge.tsx
      Button.tsx
      MarkdownRenderer.tsx        ← renders markdown with remark
      MindMap.tsx                 ← renders Mermaid diagram if present
  lib/
    content.ts                    ← reads .md files with gray-matter + remark
    progress.ts                   ← localStorage get/set/reset helpers
  messages/
    en.json
    pt.json
  content/
    en/
      frontend/javascript/...
      backend/...
    pt/
      frontend/javascript/...
```

---

## Content Rules for Contributors

Documented in `/contribute`:

1. Fork the repo and create a branch
2. Add a `.md` file in `content/en/` or `content/pt/` following the folder structure
3. Fill in frontmatter (all required fields)
4. Write the 3 sections: Full Answer, Quick Answer, Flashcard
5. Open a PR — CI validates frontmatter schema
6. Maintainer reviews and merges → Vercel auto-deploys

**Language rule:** A PR with only one language is accepted. Bilingual PRs are welcome but not required.

---

## Home Page

- Hero: portal name, tagline, CTA buttons ("Browse Questions" / "Contribute")
- How it works: 3-step explainer (Study → Test with flashcards → Contribute)
- Category preview: 3–4 featured category cards
- Contributor call-to-action: explanation of how to add questions via PR
- Link to `/support` page

---

## StoryTelling Page

Static markdown-rendered page covering:
- What StoryTelling is in the context of HR interviews
- The STAR method (Situation, Task, Action, Result)
- Example narrative templates
- Common HR questions with StoryTelling answers
- Tips for non-native speakers

Content lives in `content/[locale]/soft-skills/storytelling.md`.

---

## Out of Scope (MVP)

- User accounts or authentication
- Search functionality (can be added post-MVP with pagefind)
- Admin interface for adding content
- Email notifications
- Comments or community discussion

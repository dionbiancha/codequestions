---
title: "What is Continuous Delivery?"
category: devops
subcategory: ci-cd
tags: [ci-cd, continuous-delivery, devops, pipeline, deploy]
difficulty: pleno
lang: en
---

## Full Answer

**Continuous Delivery (CD)** is the practice of keeping software in a state where it can be released to production at any time.

**How it works**

Every code change automatically runs through a pipeline — build, automated tests (unit, integration, e2e), and quality checks. The output is a validated artifact ready to deploy. But the final push to production is triggered **manually** by a human.

```
Commit → Build → Tests → Staging → [ human approval ] → Production
```

**Why it matters**

Without CD, the cycle from writing code to shipping it can take weeks. With CD, that cycle drops to hours or minutes because:

- Tests run on every commit — bugs surface early
- The deploy artifact is always the same one that was validated
- Teams build confidence to release frequently

**CI vs CD**

- **CI (Continuous Integration):** automatically integrates and validates code (build + tests)
- **CD (Continuous Delivery):** goes further — ensures code is *always releasable*, with a predictable and repeatable release process

**Practical example**

A team practicing CD can press the deploy button on a Friday afternoon without anxiety, because the pipeline has already validated everything. Deploying becomes a non-event, not a risky ritual.

## Quick Answer

Continuous Delivery keeps software always ready to ship. Every commit runs through an automated pipeline of builds and tests, ensuring the code is deployable at any moment. The final deploy to production is triggered manually.

## Flashcard

**Q:** What is the key characteristic of Continuous Delivery?

**A:** Software is always in a deployable state — every commit passes through an automated pipeline and the resulting artifact is production-ready at any time, but the deploy is triggered manually.

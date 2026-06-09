---
title: "What is Continuous Deployment?"
category: devops
subcategory: ci-cd
tags: [ci-cd, continuous-deployment, devops, pipeline, deploy, automation]
difficulty: pleno
lang: en
---

## Full Answer

**Continuous Deployment** is the extension of Continuous Delivery where every commit that passes the pipeline goes **automatically to production** — no human approval required.

**How it works**

```
Commit → Build → Tests → Staging → Production (automatic)
```

There is no button to press. If the pipeline passes, the code is in production. If it fails, the deploy is automatically blocked.

**What it takes to do it well**

Continuous Deployment demands a solid technical foundation:

- **High test coverage** — automated tests are the only gate before production
- **Feature flags** — to decouple deploy from release (code ships to prod, but the feature stays off until ready)
- **Observability** — monitoring, alerts, and automated rollback to catch regressions fast
- **Team trust** — confidence in the pipeline, and discipline to act on alerts immediately

**Who does it**

Companies like Amazon, Netflix, and GitHub deploy dozens or hundreds of times per day using Continuous Deployment. It's the practice that makes that volume possible without sacrificing stability.

**When not to use it**

Continuous Deployment may not fit when:
- Regulation requires human sign-off before a deploy (e.g., healthcare, finance)
- Test coverage isn't reliable enough to trust the pipeline
- Production bugs are extremely costly and rollback is complex

## Quick Answer

Continuous Deployment automatically sends every commit that passes the pipeline straight to production — no manual approval. It's the evolution of Continuous Delivery: the only difference is the removal of the human deploy trigger.

## Flashcard

**Q:** What is the difference between Continuous Delivery and Continuous Deployment?

**A:** In Continuous Delivery, the production deploy is triggered manually after the pipeline passes. In Continuous Deployment, the deploy happens automatically — if the pipeline passes, the code goes straight to production with no human intervention.

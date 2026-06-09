---
title: "O que é Continuous Deployment?"
category: devops
subcategory: ci-cd
tags: [ci-cd, continuous-deployment, devops, pipeline, deploy, automação]
difficulty: pleno
lang: pt
---

## Full Answer

**Continuous Deployment** é a extensão do Continuous Delivery onde todo commit que passa pela pipeline vai **automaticamente para produção**, sem nenhuma intervenção humana.

**Como funciona**

```
Commit → Build → Testes → Homologação → Produção (automático)
```

Não há botão para apertar. Se a pipeline passar, o código está em produção. Se falhar, o deploy é bloqueado automaticamente.

**Requisitos para funcionar bem**

Continuous Deployment exige uma base técnica sólida:

- **Cobertura de testes alta** — testes automatizados são a única barreira antes da produção
- **Feature flags** — para desacoplar deploy de release (o código vai pra prod, mas a feature fica desativada até estar pronta)
- **Observabilidade** — monitoramento, alertas e rollback automatizado para detectar regressões rápido
- **Cultura de confiança** — o time confia na pipeline e age quando alertas disparam

**Quem usa**

Empresas como Amazon, Netflix e GitHub fazem dezenas ou centenas de deploys por dia com Continuous Deployment. É a prática que viabiliza esse volume sem comprometer estabilidade.

**Quando não usar**

Continuous Deployment pode não ser adequado quando há:
- Regulação que exige aprovação humana antes do deploy (ex: saúde, finanças)
- Times sem cobertura de testes suficiente para confiar na pipeline
- Produtos onde bugs em produção têm custo altíssimo e rollback é complexo

## Quick Answer

Continuous Deployment é a prática onde todo commit que passa na pipeline vai automaticamente para produção, sem aprovação manual. É a evolução do Continuous Delivery — a diferença está na ausência de intervenção humana no deploy final.

## Flashcard

**P:** Qual a diferença entre Continuous Delivery e Continuous Deployment?

**R:** No Continuous Delivery o deploy em produção é acionado manualmente após a pipeline passar. No Continuous Deployment o deploy acontece automaticamente — se a pipeline passa, o código vai direto para produção sem intervenção humana.

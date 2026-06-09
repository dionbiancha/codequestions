---
title: "O que é Continuous Delivery?"
category: devops
subcategory: ci-cd
tags: [ci-cd, continuous-delivery, devops, pipeline, deploy]
difficulty: pleno
lang: pt
---

## Full Answer

**Continuous Delivery (CD)** é a prática de manter o software sempre em um estado pronto para ser colocado em produção a qualquer momento.

**Como funciona**

Cada alteração no código passa automaticamente por uma pipeline que inclui build, testes automatizados (unitários, integração, e2e) e validações de qualidade. Ao final desse processo, o artefato gerado está validado e pronto para deploy — mas o deploy em produção ainda é **acionado manualmente** por um humano.

```
Commit → Build → Testes → Homologação → [ aprovação humana ] → Produção
```

**Por que isso importa**

Sem CD, o ciclo entre escrever código e colocá-lo em produção pode levar semanas. Com CD, esse ciclo cai para horas ou minutos, porque:

- Os testes rodam a cada commit, então bugs são encontrados cedo
- O artefato de deploy é sempre o mesmo que foi validado
- A equipe desenvolve confiança para fazer releases frequentes

**Diferença entre Continuous Integration e Continuous Delivery**

- **CI (Continuous Integration):** integra e valida o código automaticamente (build + testes)
- **CD (Continuous Delivery):** vai além — garante que o código está *sempre deployável*, com um processo de release previsível e repetível

**Exemplo prático**

Um time que usa CD pode pressionar o botão de deploy na sexta às 17h sem nervosismo, porque sabe que a pipeline validou tudo. O deploy em si é um evento trivial, não um ritual arriscado.

## Quick Answer

Continuous Delivery é a prática de manter o software sempre pronto para ir a produção. Cada commit passa por uma pipeline automatizada de build e testes, garantindo que o código está deployável a qualquer momento. O deploy final é acionado manualmente.

## Flashcard

**P:** Qual é a principal característica do Continuous Delivery?

**R:** O software é mantido sempre em estado deployável — cada commit passa por uma pipeline automatizada e o artefato resultante está pronto para produção a qualquer momento, mas o deploy é acionado manualmente.

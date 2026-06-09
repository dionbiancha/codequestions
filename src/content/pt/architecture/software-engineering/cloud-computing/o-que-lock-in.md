---
title: "O que é o conceito de lock-in em cloud computing?"
category: software-engineering
subcategory: cloud-computing
tags: [cloud, lock-in, vendor-lock-in, arquitetura]
difficulty: pleno
lang: pt
---

## Full Answer

Lock-in, ou vendor lock-in, é a situação em que uma empresa se torna altamente dependente de um provedor de nuvem, dificultando ou encarecendo a migração para outra plataforma.

Isso acontece quando a aplicação utiliza serviços, APIs ou recursos específicos de um provedor, tornando complexa a substituição por alternativas equivalentes.

Por exemplo, uma aplicação que utiliza diversos serviços proprietários da AWS pode exigir mudanças significativas de arquitetura para ser migrada para Azure ou Google Cloud.

Os principais riscos do lock-in são:
- Custos elevados de migração
- Dependência de um único fornecedor
- Menor poder de negociação
- Dificuldade para adotar novas tecnologias
- Restrições estratégicas de longo prazo

Algumas estratégias para reduzir o lock-in incluem:
- Uso de containers com Docker
- Orquestração com Kubernetes
- Adoção de padrões abertos
- Arquiteturas multi-cloud
- Evitar dependência excessiva de serviços proprietários

O lock-in não é necessariamente algo negativo. Muitas empresas aceitam esse compromisso para acelerar o desenvolvimento e aproveitar serviços gerenciados mais avançados.

## Quick Answer

Lock-in é a dependência de um provedor de nuvem que torna difícil ou custosa a migração para outra plataforma.

## Flashcard

**P:** O que é vendor lock-in?

**R:** É a dependência de um provedor de nuvem devido ao uso de tecnologias ou serviços específicos que dificultam a migração para outro fornecedor.
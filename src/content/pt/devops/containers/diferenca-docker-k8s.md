---
title: "Qual a diferença entre Docker e Kubernetes?"
category: devops
subcategory: containers
tags: [docker, kubernetes, k8s, containers, orquestração]
difficulty: pleno
lang: pt
---

## Full Answer

Docker e Kubernetes resolvem problemas diferentes, mas complementares.

O Docker é uma plataforma para criar, empacotar e executar containers. Ele permite que aplicações rodem de forma isolada e consistente em diferentes ambientes.

Já o Kubernetes (K8s) é uma plataforma de orquestração de containers. Ele gerencia múltiplos containers em escala, automatizando deploy, balanceamento de carga, escalabilidade, recuperação de falhas e gerenciamento de infraestrutura.

Em resumo:
- Docker → cria e executa containers
- Kubernetes → gerencia containers em produção

Normalmente, aplicações containerizadas com Docker são orquestradas pelo Kubernetes em ambientes distribuídos.

## Quick Answer

Docker é usado para criar e executar containers, enquanto Kubernetes é usado para orquestrar e gerenciar containers em escala.

## Flashcard

**P:** Qual a diferença entre Docker e Kubernetes?

**R:** Docker cria e executa containers; Kubernetes gerencia e orquestra containers em ambientes distribuídos.

---
title: "O que é SRE (Site Reliability Engineering)?"
category: devops
subcategory: sre
tags: [sre, confiabilidade, disponibilidade, observabilidade, operacoes]
difficulty: pleno
lang: pt
---

## Full Answer

SRE (Site Reliability Engineering) é uma disciplina criada pelo Google que aplica princípios de engenharia de software para aumentar a confiabilidade, disponibilidade e escalabilidade de sistemas.

O objetivo do SRE é garantir que os serviços sejam estáveis e confiáveis, utilizando automação para reduzir trabalho operacional manual e repetitivo.

Enquanto equipes de operações tradicionais costumam atuar de forma mais reativa, equipes SRE buscam prevenir problemas por meio de monitoramento, observabilidade, automação e melhoria contínua.

As principais responsabilidades de um SRE incluem:
- Monitoramento de sistemas
- Gestão de incidentes
- Troubleshooting
- Automação de tarefas operacionais
- Planejamento de capacidade
- Gestão de disponibilidade
- Definição de SLOs e SLIs
- Redução de toil (trabalho manual repetitivo)

Conceitos importantes em SRE:

### SLI (Service Level Indicator)

Métrica utilizada para medir a qualidade de um serviço.

Exemplos:
- Latência
- Taxa de erros
- Disponibilidade

### SLO (Service Level Objective)

Meta estabelecida para um determinado indicador.

Exemplo:
- Disponibilidade de 99,9% por mês

### SLA (Service Level Agreement)

Acordo formal entre fornecedor e cliente que define níveis mínimos de serviço e possíveis penalidades em caso de descumprimento.

Exemplo:
- Garantia contratual de 99,9% de disponibilidade

O SRE busca equilibrar velocidade de entrega e estabilidade do sistema, garantindo que novas funcionalidades sejam lançadas sem comprometer a confiabilidade do serviço.

## Quick Answer

SRE é uma disciplina que aplica engenharia de software às operações para aumentar a confiabilidade, disponibilidade e escalabilidade dos sistemas.

## Flashcard

**P:** O que é SRE?

**R:** SRE (Site Reliability Engineering) é uma disciplina focada em garantir a confiabilidade dos sistemas por meio de automação, monitoramento e práticas de engenharia de software.
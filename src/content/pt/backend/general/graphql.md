---
title: "Explique o que é GraphQL"
category: backend
subcategory: general
tags: [graphql, api, query, schema, rest, tipos]
difficulty: pleno
lang: pt
---

## Full Answer

GraphQL é uma **linguagem de consulta para APIs** e um runtime para executar essas consultas, criado pelo Facebook em 2012 e aberto ao público em 2015. É uma alternativa ao REST que dá ao cliente controle total sobre quais dados receber.

**O problema que o GraphQL resolve**

Em REST, os endpoints definem o formato da resposta. Isso gera dois problemas comuns:

- **Over-fetching** — o endpoint retorna campos que o cliente não precisa
- **Under-fetching** — o cliente precisa chamar múltiplos endpoints para montar uma tela

Com GraphQL, o cliente descreve exatamente o que quer em uma única requisição.

**Como funciona**

Tudo passa por um único endpoint (`POST /graphql`). O cliente envia uma query descrevendo a estrutura de dados desejada:

```graphql
query {
  user(id: "42") {
    name
    email
    posts {
      title
      publishedAt
    }
  }
}
```

O servidor retorna exatamente isso — nem mais, nem menos.

**Os três tipos de operação**

| Operação | Equivalente REST | Uso |
|----------|-----------------|-----|
| `query` | `GET` | Leitura de dados |
| `mutation` | `POST` / `PUT` / `DELETE` | Escrita de dados |
| `subscription` | WebSocket | Dados em tempo real |

**Schema e tipos**

O contrato da API é definido em um schema fortemente tipado:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  title: String!
  publishedAt: String
}
```

O `!` indica campo obrigatório (não-nulo). O schema é a documentação viva da API.

**GraphQL vs REST**

| | REST | GraphQL |
|---|---|---|
| Endpoints | Múltiplos | Um único |
| Formato da resposta | Definido pelo servidor | Definido pelo cliente |
| Over/under-fetching | Comum | Eliminado |
| Tipagem | Opcional (OpenAPI) | Nativa e obrigatória |
| Tempo real | Não nativo | Subscriptions |
| Curva de aprendizado | Baixa | Média |

**Quando usar GraphQL:**
- Múltiplos clientes com necessidades de dados diferentes (web, mobile, TV)
- APIs públicas com consumidores externos variados
- Telas complexas que agregam dados de múltiplas entidades

**Quando REST ainda é melhor:**
- APIs simples com poucos endpoints
- Time sem experiência em GraphQL
- Operações de upload de arquivo ou streaming

## Quick Answer

GraphQL é uma linguagem de consulta para APIs onde o cliente define exatamente quais dados quer receber. Tudo passa por um único endpoint; o schema tipado define o contrato. Resolve over-fetching e under-fetching comuns em REST. Suporta queries (leitura), mutations (escrita) e subscriptions (tempo real).

## Flashcard

**P:** O que é GraphQL e qual problema ele resolve?

**R:** GraphQL é uma linguagem de consulta para APIs onde o cliente descreve exatamente os dados que quer. Resolve over-fetching (receber dados demais) e under-fetching (precisar de múltiplas chamadas). Usa um único endpoint, schema fortemente tipado, e suporta queries, mutations e subscriptions.

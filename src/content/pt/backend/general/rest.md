---
title: "Explique o que é REST"
category: backend
subcategory: general
tags: [rest, api, http, stateless, web, arquitetura]
difficulty: beginner
lang: pt
---

## Full Answer

REST (Representational State Transfer) é um **estilo arquitetural** para projetar APIs web. Não é um protocolo nem um padrão formal — é um conjunto de restrições que, quando seguidas, produzem APIs previsíveis, escaláveis e fáceis de consumir.

**As restrições principais do REST**

1. **Cliente-Servidor** — a interface do usuário e o armazenamento de dados são separados. Cada lado evolui independentemente.

2. **Stateless (sem estado)** — cada requisição deve conter todas as informações necessárias para ser processada. O servidor não guarda sessão entre requisições. Estado de autenticação vai no header (ex: `Authorization: Bearer <token>`).

3. **Interface uniforme** — recursos são identificados por URIs e manipulados via métodos HTTP padronizados:

   | Método | Ação |
   |--------|------|
   | `GET` | Lê um recurso |
   | `POST` | Cria um novo recurso |
   | `PUT` / `PATCH` | Atualiza um recurso |
   | `DELETE` | Remove um recurso |

4. **Recursos como substantivos** — a URI identifica *o quê*, o método HTTP diz *o que fazer*:
   - `GET /users` — lista usuários
   - `POST /users` — cria um usuário
   - `GET /users/42` — busca o usuário 42
   - `DELETE /users/42` — remove o usuário 42

5. **Representações** — o servidor retorna uma representação do recurso (geralmente JSON), não o recurso em si.

6. **Cacheável** — respostas devem indicar se podem ser cacheadas, permitindo que clientes e intermediários (proxies, CDNs) reutilizem respostas.

**REST vs REST "de fato"**

Na prática, a maioria das APIs chamadas "REST" são na verdade **RESTful** no sentido informal — usam HTTP + JSON com URIs razoáveis, mas não seguem todas as restrições (ex: HATEOAS). Isso é aceitável na maioria dos contextos.

**O que REST não é:**
- Não é um protocolo (o protocolo é HTTP)
- Não é só "usar JSON"
- Não é SOAP (que é um protocolo com contrato XML formal)

## Quick Answer

REST é um estilo arquitetural para APIs web que usa HTTP de forma padronizada: recursos identificados por URIs (substantivos), manipulados por métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`). É stateless — cada requisição carrega tudo que o servidor precisa. O formato de resposta mais comum é JSON.

## Flashcard

**P:** O que é REST e quais são suas características principais?

**R:** REST é um estilo arquitetural para APIs web. Características: stateless (sem sessão no servidor), interface uniforme (URI + métodos HTTP), cliente-servidor separados, respostas cacheáveis. Recursos são substantivos na URI (`/users/42`), métodos HTTP definem a ação (`GET`, `POST`, `PUT`, `DELETE`).

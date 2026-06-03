---
title: "O que é uma API?"
category: backend
subcategory: general
tags: [api, http, rest, contrato, integração, web]
difficulty: junior
lang: pt
---

## Full Answer

API (Application Programming Interface) é um **contrato que define como dois sistemas se comunicam**. Ela expõe funcionalidades de um sistema para que outro possa utilizá-las sem precisar conhecer os detalhes internos de implementação.

**A analogia do restaurante**

Pense em um restaurante: você (cliente) não vai à cozinha preparar a comida. Você faz um pedido ao garçom (API), que leva sua solicitação à cozinha (servidor) e traz o resultado de volta. Você não precisa saber como a comida é feita — só precisa conhecer o cardápio (contrato da API).

**O que uma API define**

- **Endpoint** — onde fazer a requisição (`https://api.exemplo.com/users`)
- **Método** — o que fazer (`GET`, `POST`, `PUT`, `DELETE`)
- **Parâmetros** — o que enviar (headers, query params, body)
- **Resposta** — o formato dos dados retornados (geralmente JSON)

**Exemplo prático**

Um app de clima no seu celular não coleta dados meteorológicos. Ele chama a API de um serviço como OpenWeather:

```
GET https://api.openweathermap.org/data/2.5/weather?q=São Paulo
```

O serviço responde com JSON:

```json
{
  "city": "São Paulo",
  "temp": 24,
  "condition": "Parcialmente nublado"
}
```

O app exibe esses dados sem saber nada sobre como eles foram coletados.

**Tipos de API**

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **REST** | Usa HTTP + JSON, arquitetura stateless | GitHub API, Twitter API |
| **GraphQL** | Cliente define os dados que quer | Shopify, GitHub v4 |
| **SOAP** | Protocolo baseado em XML, mais formal | Sistemas bancários legados |
| **WebSocket** | Conexão persistente bidirecional | Chat, notificações em tempo real |
| **gRPC** | Binário, alta performance, tipado | Comunicação entre microsserviços |

**API pública vs privada**

- **Pública** — qualquer desenvolvedor pode usar (Stripe, Google Maps, OpenAI)
- **Privada** — uso interno entre sistemas da mesma empresa
- **Partner** — compartilhada com parceiros específicos mediante autenticação

**Por que APIs importam**

APIs são o que permitem que sistemas diferentes se integrem: seu app usa a API do Stripe para pagamentos, a do SendGrid para e-mails, a do Google Maps para localização — sem precisar construir nada disso do zero.

## Quick Answer

API é um contrato que define como dois sistemas se comunicam. Ela expõe funcionalidades de um serviço (endpoints, métodos, formato de resposta) para que outro sistema possa consumi-las sem conhecer a implementação interna. Na web, APIs geralmente usam HTTP e retornam JSON.

## Flashcard

**P:** O que é uma API?

**R:** API (Application Programming Interface) é um contrato que define como dois sistemas se comunicam. Ela expõe endpoints que aceitam requisições e retornam respostas em formato padronizado (geralmente JSON), permitindo que sistemas se integrem sem conhecer a implementação um do outro.

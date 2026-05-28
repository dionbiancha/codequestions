---
title: "O que são e como funcionam middlewares no Node.js?"
category: backend
subcategory: node
tags: [middleware, express, nodejs, request, response]
difficulty: intermediate
lang: pt
---

## Full Answer

Middleware é uma função que fica no meio do ciclo de requisição-resposta. Ela recebe o objeto `req`, o objeto `res` e a função `next`, podendo executar código, modificar a requisição ou resposta, encerrar o ciclo ou passar o controle para o próximo middleware.

```
Requisição → middleware 1 → middleware 2 → rota → resposta
```

### Assinatura básica

```js
function meuMiddleware(req, res, next) {
  // faz alguma coisa
  next() // passa para o próximo
}
```

Se `next()` não for chamado e a resposta também não for enviada, a requisição fica travada.

### Tipos comuns

**1. Middleware de aplicação** — executado em todas as rotas ou em rotas específicas:

```js
// todas as rotas
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// apenas /admin
app.use('/admin', autenticar)
```

**2. Middleware de rota** — aplicado a uma rota específica:

```js
app.get('/perfil', autenticar, (req, res) => {
  res.json(req.usuario)
})
```

**3. Middleware de erro** — possui quatro parâmetros; o Express identifica pelo `err` como primeiro argumento:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ erro: 'Algo deu errado' })
})
```

**4. Middleware de terceiros** — bibliotecas que se encaixam no pipeline:

```js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet())          // cabeçalhos de segurança
app.use(cors())            // controle de origem
app.use(express.json())    // parse do body JSON
```

### Ordem importa

O Express executa middlewares na ordem em que são registrados com `app.use()`. Um middleware de autenticação precisa vir antes das rotas protegidas; o middleware de erro precisa vir por último.

```js
app.use(logger)        // 1º — loga todas as requisições
app.use(autenticar)    // 2º — bloqueia se não autenticado
app.get('/dados', handler)
app.use(tratarErros)   // último — captura erros de toda a aplicação
```

### Exemplo completo: autenticação com JWT

```js
function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ erro: 'Token ausente' })
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido' })
  }
}
```

## Quick Answer

Middleware no Node.js (especialmente no Express) é uma função com acesso a `req`, `res` e `next` que intercepta o ciclo de requisição-resposta. Você os encadeia para separar responsabilidades como logging, autenticação e tratamento de erros — cada um faz sua parte e chama `next()` para passar o controle ao próximo.

## Flashcard

**P:** O que é um middleware no Express/Node.js e qual a assinatura da função?

**R:** É uma função que intercepta o pipeline de requisição-resposta. Assinatura: `(req, res, next) => {}`. Deve chamar `next()` para continuar o fluxo ou enviar uma resposta para encerrá-lo. Middlewares de erro recebem `(err, req, res, next)`.

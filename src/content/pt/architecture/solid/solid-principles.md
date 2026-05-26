---
title: "O que são os princípios SOLID?"
category: architecture
subcategory: solid
tags: [solid, oop, design-principles, clean-code]
difficulty: intermediate
lang: pt
---

## Full Answer

SOLID é um acrônimo para cinco princípios de design orientado a objetos que tornam o software mais fácil de entender, modificar e estender.

**S — Single Responsibility Principle (Princípio da Responsabilidade Única)**
Uma classe deve ter um, e apenas um, motivo para mudar. Na prática: se você descreve uma classe com "e", ela provavelmente tem responsabilidades demais.

```typescript
// Ruim: uma classe faz parsing E persistência
class UserService {
  parseCSV(data: string) { ... }
  saveToDatabase(user: User) { ... }
}

// Bom: responsabilidades separadas
class UserParser { parseCSV(data: string) { ... } }
class UserRepository { save(user: User) { ... } }
```

**O — Open/Closed Principle (Princípio Aberto/Fechado)**
Entidades de software devem ser abertas para extensão, mas fechadas para modificação. Adicione comportamento novo criando código novo, não alterando o existente.

**L — Liskov Substitution Principle (Princípio da Substituição de Liskov)**
Subtipos devem ser substituíveis pelos seus tipos base sem quebrar o comportamento. Se `Quadrado extends Retangulo` mas sobrescrever `setWidth` também muda a altura, viola o LSP — código que espera um `Retangulo` vai quebrar.

**I — Interface Segregation Principle (Princípio da Segregação de Interface)**
Nenhum cliente deve ser forçado a depender de métodos que não usa. Prefira interfaces pequenas e focadas a interfaces grandes e genéricas.

```typescript
// Ruim: uma interface grande
interface Trabalhador { trabalhar(): void; comer(): void; dormir(): void }

// Bom: dividida por papel
interface Trabalhavel { trabalhar(): void }
interface Descansavel { comer(): void; dormir(): void }
```

**D — Dependency Inversion Principle (Princípio da Inversão de Dependência)**
Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Na prática: dependa de interfaces, injete implementações.

```typescript
// Ruim: alto nível depende diretamente do baixo nível
class OrderService {
  private db = new PostgresDatabase()
}

// Bom: depende de abstração, implementação injetada
class OrderService {
  constructor(private db: Database) {}
}
```

## Quick Answer

SOLID: **S**ingle Responsibility (um motivo para mudar), **O**pen/Closed (estender sem modificar), **L**iskov Substitution (subtipos substituem o tipo base), **I**nterface Segregation (interfaces pequenas e focadas), **D**ependency Inversion (dependa de abstrações, injete implementações).

## Flashcard

**P:** O que significa cada letra do SOLID?

**R:** S — Responsabilidade Única (um motivo para mudar). O — Aberto/Fechado (aberto para extensão, fechado para modificação). L — Substituição de Liskov (subtipos substituem o tipo base). I — Segregação de Interface (interfaces pequenas). D — Inversão de Dependência (dependa de abstrações, não de implementações).

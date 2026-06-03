---
title: "What are the SOLID principles?"
category: architecture
subcategory: solid
tags: [solid, oop, design-principles, clean-code]
difficulty: pleno
lang: en
---

## Full Answer

SOLID is an acronym for five object-oriented design principles that make software easier to understand, change, and extend.

**S — Single Responsibility Principle**
A class should have one, and only one, reason to change. In practice: if you can describe a class with "and" it probably has too many responsibilities.

```typescript
// Bad: one class does parsing AND persistence
class UserService {
  parseCSV(data: string) { ... }
  saveToDatabase(user: User) { ... }
}

// Good: split responsibilities
class UserParser { parseCSV(data: string) { ... } }
class UserRepository { save(user: User) { ... } }
```

**O — Open/Closed Principle**
Software entities should be open for extension but closed for modification. Add new behavior by adding new code, not changing existing code.

**L — Liskov Substitution Principle**
Subtypes must be substitutable for their base types without breaking behavior. If `Square extends Rectangle` but overriding `setWidth` also changes height, it violates LSP — code expecting a `Rectangle` will break.

**I — Interface Segregation Principle**
No client should be forced to depend on methods it does not use. Prefer small, focused interfaces over large fat ones.

```typescript
// Bad: one large interface
interface Worker { work(): void; eat(): void; sleep(): void }

// Good: split by role
interface Workable { work(): void }
interface Restable { eat(): void; sleep(): void }
```

**D — Dependency Inversion Principle**
High-level modules should not depend on low-level modules. Both should depend on abstractions. Concretely: depend on interfaces, inject implementations.

```typescript
// Bad: high-level depends directly on low-level
class OrderService {
  private db = new PostgresDatabase()
}

// Good: depends on abstraction, implementation injected
class OrderService {
  constructor(private db: Database) {}
}
```

These principles work together: SRP keeps classes focused, OCP enables extension, LSP ensures safe inheritance, ISP prevents bloated interfaces, DIP enables flexibility through abstractions.

## Quick Answer

SOLID: **S**ingle Responsibility (one reason to change), **O**pen/Closed (extend without modifying), **L**iskov Substitution (subtypes must be replaceable), **I**nterface Segregation (small focused interfaces), **D**ependency Inversion (depend on abstractions, inject implementations).

## Flashcard

**Q:** What does each letter in SOLID stand for?

**A:** S — Single Responsibility (one reason to change). O — Open/Closed (open for extension, closed for modification). L — Liskov Substitution (subtypes replaceable for base types). I — Interface Segregation (small focused interfaces). D — Dependency Inversion (depend on abstractions, not concretions).

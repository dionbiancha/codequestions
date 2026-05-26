---
title: "What is the difference between SQL and NoSQL databases?"
category: backend
subcategory: general
tags: [database, sql, nosql, relational, mongodb, postgres]
difficulty: intermediate
lang: en
---

## Full Answer

SQL and NoSQL databases take fundamentally different approaches to storing and querying data.

**SQL (Relational databases)**

Data is stored in tables with rows and columns. The schema is defined upfront and enforced — every row must conform to the table structure. Relationships between tables are expressed with foreign keys and joined at query time.

Examples: PostgreSQL, MySQL, SQLite, SQL Server.

Strengths:
- ACID transactions — atomicity, consistency, isolation, durability
- Powerful joins and aggregations with a standardized query language
- Well-suited when data has a clear, stable structure and relationships matter

**NoSQL (Non-relational databases)**

"NoSQL" covers several different storage models:
- **Document stores** (MongoDB, Firestore) — store JSON-like documents, flexible schema
- **Key-value stores** (Redis, DynamoDB) — fast lookup by key, great for caching and sessions
- **Wide-column stores** (Cassandra) — optimized for high write throughput and time-series data
- **Graph databases** (Neo4j) — nodes and edges, optimized for relationship queries

Strengths:
- Flexible or schema-less — easy to evolve data shape over time
- Horizontal scaling is simpler for most NoSQL types
- High write throughput in specialized engines

**Choosing between them:**

Use SQL when:
- Data is structured and relational (orders → customers → products)
- You need strong consistency and complex transactions
- You have reporting or analytics requirements

Use NoSQL when:
- Schema changes frequently or is unknown upfront
- You need high write throughput at scale
- Your data model maps naturally to documents, key-value pairs, or graphs

Most modern applications use both — a relational DB for core entities and a NoSQL store for caching, logs, or search.

## Quick Answer

SQL stores data in tables with a fixed schema and supports ACID transactions and joins. NoSQL covers document, key-value, wide-column, and graph databases — flexible schema, designed for horizontal scale. Use SQL for relational structured data with complex queries; NoSQL for flexible schemas and high throughput.

## Flashcard

**Q:** What are the main trade-offs between SQL and NoSQL databases?

**A:** SQL: structured schema, ACID transactions, powerful joins — great for relational data. NoSQL: flexible schema, horizontal scale, high throughput — great for documents, key-value, or graph data. Most systems use both.

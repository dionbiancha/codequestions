---
title: "How does the Node.js event loop work?"
category: backend
subcategory: node
tags: [event-loop, async, non-blocking, libuv]
difficulty: pleno
lang: en
---

## Full Answer

The Node.js event loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel or libuv thread pool and resumes execution when they complete.

**Phases of the event loop (in order):**

1. **timers** — executes `setTimeout` and `setInterval` callbacks
2. **pending callbacks** — I/O callbacks deferred from the previous iteration
3. **idle, prepare** — internal use only
4. **poll** — retrieves new I/O events; blocks here if queue is empty
5. **check** — executes `setImmediate` callbacks
6. **close callbacks** — handles `close` events

Between each phase, Node.js drains `process.nextTick` and Promise microtask queues completely.

## Quick Answer

The event loop processes callbacks across 6 phases, draining microtasks (`nextTick`, Promises) between each. It allows Node.js to handle concurrent I/O without threads by deferring work to the OS/libuv.

## Flashcard

**Q:** What is the execution order of `process.nextTick`, `Promise.then`, `setImmediate`, and `setTimeout(fn, 0)`?

**A:** `process.nextTick` → `Promise.then` (microtasks, before next phase) → `setTimeout(fn, 0)` (timers phase) → `setImmediate` (check phase, after I/O poll).

---
title: "What is Docker and why is it used?"
category: devops
subcategory: docker
tags: [docker, containers, devops, deployment, images]
difficulty: beginner
lang: en
---

## Full Answer

**Docker** is a platform for building, running, and shipping applications in **containers** — lightweight, isolated environments that package the application code together with all its dependencies (runtime, libraries, config).

**The core problem Docker solves**

"It works on my machine" — Docker eliminates environment inconsistencies by making the environment part of the artifact. The same container image runs identically on a developer's laptop, a CI server, and production.

**Key concepts**

- **Image** — a read-only template (snapshot) of a file system with your app and dependencies. Built from a `Dockerfile`.
- **Container** — a running instance of an image. Isolated from the host and other containers via Linux namespaces and cgroups.
- **Dockerfile** — a text file with instructions for building an image:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

- **Registry** — a repository for storing and sharing images. Docker Hub is the public default; AWS ECR, Google Artifact Registry, and GitHub Container Registry are common private options.
- **Docker Compose** — a tool to define and run multi-container applications (e.g., app + database + cache) with a single `docker-compose.yml`.

**Containers vs. VMs**

Virtual machines virtualize hardware and run a full OS per VM — heavy (GBs). Containers share the host OS kernel — lightweight (MBs), start in seconds, and run thousands per host.

**Common use cases:**
- Consistent dev environments across the team
- CI/CD pipelines that build and test in isolation
- Microservices deployment
- Running services locally without installing them (postgres, redis, etc.)

## Quick Answer

Docker packages applications in containers — isolated environments with all dependencies baked in. This guarantees the same behavior everywhere (dev, CI, prod). Key objects: Image (template), Container (running instance), Dockerfile (build recipe), Docker Compose (multi-container orchestration).

## Flashcard

**Q:** What is the difference between a Docker image and a Docker container?

**A:** An image is a read-only snapshot of the app and its dependencies, built from a Dockerfile. A container is a running instance of an image — isolated, lightweight, and disposable.

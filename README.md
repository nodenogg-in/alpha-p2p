# nodenogg.in

nodenogg.in is free / libre open source software, built in the open, inclusive by design, private by design, humane centred by design, delightful by design, intuitive and decentralised by design.

## About

This project is organised as a pnpm monorepo. You can read more about pnpm's workspace feature [here](https://pnpm.io/workspaces).

## Setup

1. Install `pnpm` using [these instructions](https://pnpm.io/installation).
2. Install dependencies for the project (in the root directory of this project).

```bash
pnpm install
```

3. (Optional) We recommend using [VSCode](https://code.visualstudio.com/). For working with Vue code, we recommend installing the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) plugin.

# Container development

## Install docker

We recommend using [Docker Desktop](https://docs.docker.com/get-docker/) for development. See [docker's website](https://docs.docker.com/get-docker/) for instructions.

## Build and run the whole system

```bash
docker compose up --build

# optionally set environment
NODE_ENV=production docker compose up --build
```

## Build and run a specific service

```bash
# build and run the web app service
docker compose up --build nodenoggin-web-app-service

# build and run the server service
docker compose up --build nodenoggin-yjs-sync-server-service
```

#### Stop a specific service

```bash
docker compose stop nodenoggin-web-app-service
docker compose stop nodenoggin-yjs-sync-server-service
```

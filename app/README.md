<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bc9ecc3 (finally got to reliable vue/yjs integration)
# nodenogg.in App
This is the client app for nodenogg.in.

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
=======
# nodenogg.in

nodenogg.in is free / libre open source software, built in the open, inclusive by design, private by design, humane centred by design, delightful by design, intuitive and decentralised by design.

## About

This project is organised as a pnpm monorepo with two main apps in the workspace.

1. [`nodenoggin-app`](./app) is the main client app built in [vue](https://vuejs.org/). The app uses [Yjs](https://yjs.dev/) for managing collaborative editing.
2. [`nodenoggin-server`](./server) is a dedicated signalling server which allows users of the app to connect via [WebRTC](https://webrtc.org/).

You can read more about pnpm's workspace feature [here](https://pnpm.io/workspaces).

## Setup

1. Install `pnpm` using [these instructions](https://pnpm.io/installation).
2. Install dependencies for the project (in the root directory of this project).

```bash
pnpm install
```

3. (Optional) We recommend using [VSCode](https://code.visualstudio.com/). For working with Vue code, we recommend installing the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) plugin.

## Scripts

There are two main development scripts depending on how you want to develop the app.

### `dev:local-server`

This will run both the [`app`](./app/) and a local version of the [`server`](./server/) simultaneously. This means the the whole system is running locally, you will only be able to view and sync changes on your own machine.

You might want to do this for a number of reasons:
  - You want to avoid placing the burden of random connections onto the public server.
  - You don't want local test microcosms to get accidentally synced with public peers.
  - You need to work offline or on an unreliable connection.
  - You want a very fast sync option for rapid prototyping.
  - You want to debug or change the server.

> Note: at the moment the public sync is manually deployed to [fly.io](https://fly.io/) while we work out a more sustainable long-term option.

```bash
pnpm dev:local-server
```

### `dev:production-server`

This will run just the [`app`](./app/) and will connect to nodenogg.in's public WebRTC sync server.

This will let you connect to other users elsewhere on the web.

```
pnpm dev:production-server
>>>>>>> 251788f (switched to monorepo)
```

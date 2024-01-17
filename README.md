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

In the root directory you can run two scripts.

- `pnpm dev:local-server` will run both the app and the server simultaneously. This means the the whole system is running locally.
- `pnpm dev:production-server` will run just the app and connect to nodenogg.in's public WebRTC sync server. This means you will be able to sync with other users.

---
title: Codebase
description: An introduction to nodenogg.in's codebase
---
import { FileTree } from '@astrojs/starlight/components';

nodenogg.in is a web application written entirely in Typescript/Javascript. The codebase is split up into modules which are all managed in this monorepo. The API documentation for each of the modules is shown here, towards the bottom of the sidebar.

#### Monorepo structure
<FileTree>

- [app/]()
- internal
    - [microcosm/](/microcosm/readme)
- api
    - y-microcosm/
    - y-webrtc-server/

</FileTree>

#### Summary of each module

##### [`internal/microcosm`](/microcosm/readme)

The schema and base APIs: these describe the structure of data and how it flows through the nodenogg.in application.

##### [`internal/framework`](/framework/readme)

The logic and state for the nodenogg.in app: this manages the nodenogg.in app, loads and makes data available to the front-end.

##### [`internal/io`](/io/readme)

Importers/exporters for Microcosms, used for things like processing and validating files, exporting backups or snaphots. Supports bi-directional import and export from JSON, HTML and Markdown.

##### [`packages/statekit`](/statekit/readme)

Our handmade reactive state/signals library. UI-agnostic.

##### [`packages/infinitykit`](/infinitykit/readme)

Our library for creating spatial canvas components. UI-agnostic.

##### [`packages/toolkit`](/toolkit/readme)

Our grab bag of helpers and utility functions.

##### `api/y-microcosm`

This is the main implementation of the `EditableMicrocosmAPI` (in [`microcosm`](/microcosm/readme)). This uses [Yjs](https://yjs.dev/) to allow multiple users to collaborate in real time in the same microcosm.

##### `api/y-webrtc-server`

To enable collaboration features in `y-microcosm`, we need a signalling server to help connect peers. This is a node.js app that does exactly that.

##### `app`

We combine all of the libraries above in the app, which is written in [Vue.js](https://vuejs.org/). This is a single page app which is what users will see.

##### `docs`

Our documentation, which is what you're reading now.

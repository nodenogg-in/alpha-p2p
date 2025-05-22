---
title: Synchronisation
description: How does nodenogg.in support multiplayer creativity?
---

The core nodenogg.in [**Microcosm**](/architecture/01-overview#microcosm) spec only describes a data structure and API for how **Microcosms** work. This is highly flexible, meaning that in theory any backend or sync mechanism could be used, so long as its key functionality can be exposed through a [`MicrocosmAPI`](/microcosm/classes/microcosmapi/) or [`EditableMicrocosmAPI`](/microcosm/classes/editablemicrocosmapi/).

Whilst the most obvious existing best practise would be to host a database and server and have that as the source of truth, that doesn't really align with the [project principles](/principles). Therefore, during 2024 we are exploring different **strategies** for creating multiplayer, synchronised Microcosms.

## Strategies

### y-microcosm

The first implementation of the `MicrocosmAPI` is based on [Yjs](https://yjs.dev/) and uses [WebRTC](https://github.com/yjs/y-webrtc) as the transport layer. Data is persisted locally in the browser using the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), for which Yjs [has a 'persistence' provider](https://github.com/yjs/y-indexeddb).

There are two parts to this implementation:

- [`y-microcosm`](): The browser API for creating a collaborative **Microcosm** based on Yjs.
- [`y-webrtc-server`](): A node.js application running a WebSocket signalling server; this allows individual clients to broker WebRTC connections.

## Proposed strategies

### earthstar-microcosm

We're interested in evaluating whether the [Earthstar project](https://earthstar-project.org/) could be used as an effective transport/data storage layer for Microcosms.

### torrent-microcosm

Our initial experiments used the [trystero](https://github.com/dmotz/trystero/) library. We're interested to see whether a bittorrent server could effectively broker WebRTC connections.

### automerge-microcosm

We struggled with our initial tests with the [Automerge library](https://automerge.org/), finding it much too complex and heavy for what we needed. We also struggled with getting a sync service up and running in a way that made it easy to understand how the system worked. However Automerge is obviously extremely powerful, so it merits further exploration.

### Additional approaches
* A more traditional WebSocket implementation using the existing `y-microcosm` with [hocuspocus](https://github.com/ueberdosis/hocuspocus).
* [DXOS](https://docs.dxos.org/)
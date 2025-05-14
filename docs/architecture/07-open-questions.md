---
title: Open questions
description: nodenogg.in questions
---

::: warning DRAFT
This section is a draft and these open questions may be pure speculation and subject to change.
:::

Here is where we document open, unanswered questions and technical challenges. They may will be specifically related to the `YMicrocosm` implementation, and this list may change as we evaluate different options.

## Where to store media?

##### The problem

Media upload and persistence feels like table stakes for any whiteboard or collaboration tool. Is there a danger that we put people off with the absence of this functionality?

In the absence of a browsers like [Beaker](https://github.com/beakerbrowser/beaker/blob/master/archive-notice.md) it's hard to know what the best path forwards is for sharing and syncing arbitrary data.

##### Ideas

- Can we make nodenogg.in's proposition clearer to say that it's text only?
- Whilst WebRTC/WebSocket transport strategies work well for text, how can media (images, video or any attachments) be shared and stored?
- What can we do that avoids the need to run another server?
- The browser doesn't offer its own filesystem or storage mechanism for binary data - 'true' local-first media feels essentially impossible without asking users to download a native desktop app and then leverage the local file system. Even then there is the challenge of how to sync that media efficiently and whether there is a safe option that is peer-to-peer.
- We have evaluated IPFS/Helia but much more work needs to be done as the implementation left a lot to be desired.

###### Some starting points:

- [Pear by Holepunch](https://docs.pears.com/)
- [IPFS Helia](https://github.com/ipfs/helia)
- [Earthstar](https://earthstar-project.org/)

## How to scale?

##### The problem

We already know that WebRTC-based approaches that are truly P2P are a real struggle to scale effectively and reliably. This is because peer maintains a WebRTC connection to every other connected peer.

##### Ideas

- We need to start testing exactly where the stress points and limits of WebRTC are.
- For now, whilst the user group for nodenogg.in is very small, this approach works (i.e. multiple users can safely join a common namespace e.g. `https://nodenogg.in/microcosm/workshop`). This clearly might not scale for large groups.
- It seems that the inevitable next step is assigning unique UUIDs (e.g. `https://nodenogg.in/microcosm/f7df6cd1-4a2c-4cc6-9726-dc8575848946`) is the only safe approach if there is to be no server to mediate connections beyond the initial WebRTC handshake.
- An alternative, slightly more human-friendly approach could be a meaningful word + short UUID, e.g. (e.g. `workshop-f7df6cd1`).

## How do we see and analyse usage?

##### The problem

It would be great to see how people are using the app. How can we keep an eye on performance, logging, errors and general telemetry without adding admin overhead?

##### Ideas

- We could consider open-source monitoring/analytics options but we want to avoid burdening this project with lots of dependencies and it feels like (for e.g. Prometheus) would burden us with far more information and overhead than is necessary for a free, indie app.
- At the same time we are firmly against anything that feels close to surveillance or tracking.
- It seems clear that we should rule out third-party services like [Sentry](https://sentry.io/) or [Segment](https://segment.com/). Could [Fathom](https://usefathom.com/) or [Cabin](https://withcabin.com/) be a credible alternative.
- Could we have a deliberate opt in? How might this feel nice, collaborative and inviting? (i.e. definitely not a GDPR cookie banner).
- The Telemetry module includes a dummy endpoint to which telemetry/logging events are sent.

## How to authenticate?

##### The problem

We don't yet have a clear perspective does an individual prove they are the author of a certain collection of nodes? Surely a user's nodes need to be signed somehow?

There is no cryptographic guarantee (in the implementation so far) that only the author of a node may edit it. At the moment, the `EditableMicrocosmAPI` design suggests that only a user's collection of nodes can be edited. But the fundamental architecture of Yjs makes it very challenging to implement field-level authentication within a shared document. So in practise any user can edit any node, which is not aligned to the principles of the project.

##### Ideas

- [ ] Right now, the `MicrocosmAPI` does not impose or imply authentication or encryption, assuming that these things will be handled by specific implementations. This makes sense because, for example, Yjs vs Automerge work in quite different ways. Under the hood their implementation, sync and authentication code will look quite different. Maybe there's still a way to generalise authentication/encyption at the `MicrocosmAPI` layer, however?
- [ ] Could there be a solution or a template for a solution in [`@localfirst/auth`](https://github.com/local-first-web/auth)?
- [ ] One solution could to use the built-in [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), or most likely a convenience library that wraps it. Each user creates a keypair and is encouraged to keep a copy of a local passphrase. The Yjs document then includes a record of id/public passphrase pairs and validates the contents of Yjs document before displaying in the applicaiton.
- [ ] We experimented a little with `RSASSA-PKCS1` keypairs using the [Crypto.subtle](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle) but this was only really a stub. We probably don't have the bandwidth or technical expertise to implement this at present (without introducing a crypto library).

## How to encrypt?

##### Ideas

- See [End-to-End Encryption in the Browser](https://blog.excalidraw.com/end-to-end-encryption/) from [Excalidraw](https://excalidraw.com/)

## Codebase organisation

##### The problem

It's hard to manage a large monorepo (including publishing packages, linting, building etc.) without adding a whole load of workflow dependencies.

##### Ideas

- Moving the codebase over to [Bun](https://bun.sh/) or [Deno](https://deno.land/) could be interesting in trying to simplify the codebase and also allow the team to experiment on the cutting edge.
- Simplicity of being able to compile single executables to run a Microcosm sync instance could open up possibilities in DIY hosting (although it will also be interesting when Single Executable Applications are available in node.js, [which is arriving in v21.7.1](https://nodejs.org/api/single-executable-applications.html#single-executable-applications))
- Bun seems to have a very powerful built-in [WebSocket server](https://bun.sh/docs/api/websockets) which could be a good replacement for the `y-webrtc` signalling server implementation we have already adapted from the Yjs examples.
- Further reduce dependencies by using Bun's integrated testing and Typescript execution features
- We should, however probably add [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as we try to establish some process and best practise for development

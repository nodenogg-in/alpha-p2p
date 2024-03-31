---
title: Deploying nodenogg.in
---

At its core the nodenogg.in app is all based in the browser so all that's needed is a straightforward deployment of a single page app. This is widely supported and documented on a variety of different platforms.

With specific synchronisation strategies, some sort of server (whether it's a WebSocket server, a signalling server) needs to be hosted to enable peer discovery and brokering connections. So this guide is based around deployment using the `y-microcosm` implementation. This requires the `y-webrtc-server` to be running.

In the future, we hope to evaluate a number of different sync strategies and can have one reliable and tested approach. However, it might be that this modularity is attractive, meaning users can bring their own choice of sync, storage and authentication.

## Requirements
- List of requirements

## Guides

### Azure

- Microsoft Azure notes

### Vercel

- Vercel notes

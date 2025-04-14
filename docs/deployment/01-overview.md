---
title: Deploying nodenogg.in
---

# Deploying nodenogg.in

Because nodenogg.in is a decentralised app, it might feel a little different when compared to a conventional web app.

The main app should feel familiar, as an Single Page Application (SPA) it is built as a collection of static files that can be easily and cheaply hosted.

Because nodenogg.in is collaborative and decentralised, we need to find ways to coordinate everyone. This is where the server comes in.

With specific synchronisation strategies, some sort of server (whether it's a WebSocket server, a signalling server) needs to be hosted to enable peer discovery and brokering connections. So this guide is based around deployment using the `y-microcosm` implementation. This requires the `y-webrtc-server` to be running.

In the future, we hope to evaluate a number of different sync strategies and can have one reliable and tested approach. However, it might be that this modularity is attractive, meaning users can bring their own choice of sync, storage and authentication.

## Requirements

- List of requirements

## Guides

### Azure

- Microsoft Azure notes

### Vercel

- Vercel notes

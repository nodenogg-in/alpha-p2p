---
editUrl: false
next: false
prev: false
title: "@nodenogg.in/framework"
---

This package provides tools for creating the state and logic that runs nodenogg.in. `@nodenogg.in/framework` doesn't make any assumptions about the front-end implementation (whether it's Vue, React, Svelte or no framework at all).

# Example

```ts
import { createApp } from '@nodenogg.in/framework'
import * as defaultViews from '@nodenogg.in/framework/views'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

// We create an API which returns an instance implementing the MicrocosmAPI
// or EditableMicrocosmAPI interface.
const api = createYMicrocosmAPI({
  // customWebrtcServerUrl may come from environment variables or elsewhere
  provider: createWebRTCProvider(customWebrtcServerUrl)
})

export const { ready, ui, session, telemetry, dispose, microcosms, views } = createApp({
  // API for creating MicrocosmAPIs
  api,
  // The views you want to add
  views: defaultViews,
  // The view that's visible by default
  defaultView: 'spatial',
  // Add telemetry to create logging in the app
  telemetry: {
    // Log: true adds console messages
    log: true
  }
})
```

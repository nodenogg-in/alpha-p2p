---
editUrl: false
next: false
prev: false
title: "fsm"
---

> **fsm**\<`States`, `Events`\>(`initialState`, `transitions`): [`SignalFSM`](../type-aliases/SignalFSM.md)\<`States`, `Events`\>

Creates a basic [Signal](../../../../../../statekit/type-aliases/signal)-based finite state machine that can transition between states

## Type parameters

• **States** extends `string`

• **Events** extends `string`

## Parameters

• **initialState**: `States`

• **transitions**: `{ [State in string]: { [Event in string]?: States } }`

## Returns

[`SignalFSM`](../type-aliases/SignalFSM.md)\<`States`, `Events`\>

## Source

[fsm.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/fsm.ts#L12)

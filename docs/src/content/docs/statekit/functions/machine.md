---
editUrl: false
next: false
prev: false
title: "machine"
---

> **machine**\<`States`, `Events`, `D`\>(`initialState`, `transitions`, `dataStore`): [`SignalMachine`](../type-aliases/SignalMachine.md)\<`States`, `Events`, `D`\>

Creates a really basic [Signal](../../../../../../statekit/type-aliases/signal)-based finite state machine that can transition between states

## Type parameters

• **States** extends `string`

• **Events** extends `string`

• **D** extends `object`

## Parameters

• **initialState**: `States`

• **transitions**: [`SignalMachineTransitions`](../type-aliases/SignalMachineTransitions.md)\<`States`, `Events`, `D`\>

• **dataStore**= `undefined`

## Returns

[`SignalMachine`](../type-aliases/SignalMachine.md)\<`States`, `Events`, `D`\>

## Source

machine.ts:12

---
editUrl: false
next: false
prev: false
title: "CanvasActions"
---

> **CanvasActions**: `Object`

## Type declaration

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### events

> **events**: `Events`\<[`InfinityKitEvents`](InfinityKitEvents.md)\>

### finish()

> **finish**: (`pointer`) => `void`

#### Parameters

• **pointer**: [`PointerState`](PointerState.md)

#### Returns

`void`

### is()

> **is**: (`state`) => `boolean`

#### Parameters

• **state**: `ActionState`

#### Returns

`boolean`

### machine

> **machine**: `ReturnType`\<*typeof* `createStateMachine`\>

### reset()

> **reset**: () => `void`

#### Returns

`void`

### rest()

> **rest**: () => `void`

#### Returns

`void`

### selectionGroup

> **selectionGroup**: `Signal`\<`SelectionBox`\>

### start()

> **start**: (`ps`) => `void`

#### Parameters

• **ps**: [`PointerState`](PointerState.md)

#### Returns

`void`

### state

> **state**: `SignalObject`\<[`CanvasActionsState`](CanvasActionsState.md)\>

### update()

> **update**: (`pointer`) => `void`

#### Parameters

• **pointer**: [`PointerState`](PointerState.md)

#### Returns

`void`

## Source

[CanvasActions.ts:286](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/infinitykit/src/CanvasActions.ts#L286)

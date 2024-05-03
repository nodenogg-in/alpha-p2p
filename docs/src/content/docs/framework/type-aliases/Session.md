---
editUrl: false
next: false
prev: false
title: "Session"
---

> **Session**: `Object`

## Type declaration

### active

> **active**: `Signal`\<`MicrocosmID` \| `undefined`\>

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### isActive()

> **isActive**: (`microcosmID`) => `boolean`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`boolean`

### microcosms

> **microcosms**: `ReadonlySignal`\<`MicrocosmReference`[]\>

### ready

> **ready**: `Signal`\<`boolean`\>

### register()

> **register**: (`request`) => `MicrocosmReference`

#### Parameters

• **request**: [`MicrocosmEntryRequest`](MicrocosmEntryRequest.md)

#### Returns

`MicrocosmReference`

### remove()

> **remove**: (`microcosmID`) => `void`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`void`

### setActive()

> **setActive**: (`microcosmID`) => `void`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`void`

## Source

[session.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/framework/src/session.ts#L86)

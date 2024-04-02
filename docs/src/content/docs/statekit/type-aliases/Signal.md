---
editUrl: false
next: false
prev: false
title: "Signal"
---

> **Signal**\<`V`\>: `Object`

## Type parameters

• **V**

## Type declaration

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### get()

> **get**: () => `V`

#### Returns

`V`

### on()

> **on**: (`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• **sub**: [`Subscription`](Subscription.md)\<`V`\>

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `V` \| `Partial`\<`V`\> \| (`state`) => `V` \| `Partial`\<`V`\>

• **sync?**: `boolean`

#### Returns

`void`

### use()

> **use**: (...`sub`) => `void`

#### Parameters

• ...**sub**: [`Unsubscribe`](Unsubscribe.md)[]

#### Returns

`void`

## Source

[signal.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/265a0e2/packages/statekit/src/signal.ts#L73)

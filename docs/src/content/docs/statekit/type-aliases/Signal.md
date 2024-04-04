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

### id

> **id**: `string`

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

[api.ts:11](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L11)

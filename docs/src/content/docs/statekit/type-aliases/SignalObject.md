---
editUrl: false
next: false
prev: false
title: "SignalObject"
---

> **SignalObject**\<`R`, `K`\>: `Object`

## Type parameters

• **R** extends `Record`\<`string`, `any`\>

• **K** extends keyof `R` = keyof `R`

## Type declaration

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### get()

> **get**: () => `R`

#### Returns

`R`

### key()

> **key**: \<`K`\>(`key`) => [`Signal`](Signal.md)\<`R`\[`K`\]\>

#### Type parameters

• **K** extends keyof `R`

#### Parameters

• **key**: `K`

#### Returns

[`Signal`](Signal.md)\<`R`\[`K`\]\>

### keys

> **keys**: `K`[]

### on()

> **on**: (`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• **sub**: [`Subscription`](Subscription.md)\<`R`\>

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### set()

> **set**: (`u`, `sync`?) => `void`

#### Parameters

• **u**: `Partial`\<`R`\>

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

[signal-object.ts:5](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/signal-object.ts#L5)

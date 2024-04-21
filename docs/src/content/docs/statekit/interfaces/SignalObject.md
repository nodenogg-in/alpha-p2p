---
editUrl: false
next: false
prev: false
title: "SignalObject"
---

## Extends

- [`Signal`](../type-aliases/Signal.md)\<`R`\>

## Type parameters

• **R** extends `Record`\<`string`, `any`\>

• **K** extends keyof `R` = keyof `R`

## Properties

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

`Signal.dispose`

#### Source

[api.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L16)

***

### get()

> **get**: () => `R`

#### Returns

`R`

#### Inherited from

`Signal.get`

#### Source

[api.ts:15](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L15)

***

### id

> **id**: `string`

#### Inherited from

`Signal.id`

#### Source

[api.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L12)

***

### key()

> **key**: \<`K`\>(`key`) => [`Signal`](../type-aliases/Signal.md)\<`R`\[`K`\]\>

#### Type parameters

• **K** extends `string` \| `number` \| `symbol`

#### Parameters

• **key**: `K`

#### Returns

[`Signal`](../type-aliases/Signal.md)\<`R`\[`K`\]\>

#### Source

[api.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L22)

***

### keys

> **keys**: `K`[]

#### Source

[api.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L23)

***

### on()

> **on**: (`sub`) => [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• **sub**: [`Subscription`](../type-aliases/Subscription.md)\<`R`\>

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Inherited from

`Signal.on`

#### Source

[api.ts:14](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L14)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `R` \| `Partial`\<`R`\> \| (`state`) => `R` \| `Partial`\<`R`\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`Signal.set`

#### Source

[api.ts:13](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L13)

***

### use()

> **use**: (...`sub`) => `void`

#### Parameters

• ...**sub**: [`Unsubscribe`](../type-aliases/Unsubscribe.md)[]

#### Returns

`void`

#### Inherited from

`Signal.use`

#### Source

[api.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L17)

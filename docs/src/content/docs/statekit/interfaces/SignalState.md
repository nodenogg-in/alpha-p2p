---
editUrl: false
next: false
prev: false
title: "SignalState"
---

## Extends

- [`SignalObject`](SignalObject.md)\<`R`, `K`\>

## Type parameters

• **R** extends `Record`\<`string`, `any`\>

• **K** extends keyof `R` = keyof `R`

## Properties

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

[`SignalObject`](SignalObject.md).[`dispose`](SignalObject.md#dispose)

#### Source

[api.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L16)

***

### get()

> **get**: () => `R`

#### Returns

`R`

#### Inherited from

[`SignalObject`](SignalObject.md).[`get`](SignalObject.md#get)

#### Source

[api.ts:15](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L15)

***

### id

> **id**: `string`

#### Inherited from

[`SignalObject`](SignalObject.md).[`id`](SignalObject.md#id)

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

#### Inherited from

[`SignalObject`](SignalObject.md).[`key`](SignalObject.md#key)

#### Source

[api.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L22)

***

### keys

> **keys**: `K`[]

#### Inherited from

[`SignalObject`](SignalObject.md).[`keys`](SignalObject.md#keys)

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

[`SignalObject`](SignalObject.md).[`on`](SignalObject.md#on)

#### Source

[api.ts:14](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L14)

***

### reset()

> **reset**: () => `void`

#### Returns

`void`

#### Source

[api.ts:48](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L48)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `R` \| `Partial`\<`R`\> \| (`state`) => `R` \| `Partial`\<`R`\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

[`SignalObject`](SignalObject.md).[`set`](SignalObject.md#set)

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

[`SignalObject`](SignalObject.md).[`use`](SignalObject.md#use)

#### Source

[api.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L17)

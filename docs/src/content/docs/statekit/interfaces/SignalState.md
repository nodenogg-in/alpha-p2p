---
editUrl: false
next: false
prev: false
title: "SignalState"
---

## Type parameters

• **S** extends `object`

• **K** extends `string` & keyof `S` = `string` & keyof `S`

## Properties

### dispose()

> **dispose**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[api.ts:36](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L36)

***

### get()

> **get**: () => `S`

#### Returns

`S`

#### Source

[api.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L33)

***

### id

> **id**: `string`

#### Source

[api.ts:30](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L30)

***

### key()

> **key**: \<`Key`\>(`k`) => [`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Type parameters

• **Key** extends `string` = `K`

#### Parameters

• **k**: `Key`

#### Returns

[`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Source

[api.ts:34](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L34)

***

### on()

> **on**: (`sub`) => [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• **sub**

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[api.ts:35](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L35)

***

### resetInitial()

> **resetInitial**: () => `void`

#### Returns

`void`

#### Source

[api.ts:38](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L38)

***

### set()

> **set**: (`u`, `sync`) => `void`

#### Parameters

• **u**: `Partial`\<`S`\>

• **sync**: `boolean`

#### Returns

`void`

#### Source

[api.ts:32](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L32)

***

### signal

> **signal**: [`SignalObject`](../type-aliases/SignalObject.md)\<`S`, keyof `S`\>

#### Source

[api.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L31)

***

### use()

> **use**: (...`sub`) => [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• ...**sub**: [`Unsubscribe`](../type-aliases/Unsubscribe.md)[]

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[api.ts:37](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L37)

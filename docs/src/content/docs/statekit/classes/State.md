---
editUrl: false
next: false
prev: false
title: "State"
---

## Type parameters

• **S** extends `object`

• **K** extends `string` & keyof `S` = `string` & keyof `S`

## Constructors

### new State(__namedParameters)

> **new State**\<`S`, `K`\>(`__namedParameters`): [`State`](State.md)\<`S`, `K`\>

#### Parameters

• **\_\_namedParameters**: [`StateOptions`](../type-aliases/StateOptions.md)\<`S`\>

#### Returns

[`State`](State.md)\<`S`, `K`\>

#### Source

[State.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L25)

## Properties

### signal

> **signal**: [`SignalObject`](../type-aliases/SignalObject.md)\<`S`\>

#### Source

[State.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L19)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[State.ts:71](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L71)

***

### get()

> **get**(): `S`

#### Returns

`S`

#### Source

[State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L63)

***

### key()

> **key**\<`Key`\>(`k`): [`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Type parameters

• **Key** extends `string` = `K`

#### Parameters

• **k**: `Key`

#### Returns

[`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Source

[State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L65)

***

### on()

> **on**(`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• **sub**

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L68)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Source

[State.ts:88](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L88)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`S`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Source

[State.ts:57](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L57)

***

### use()

> **use**(...`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• ...**sub**: [`Unsubscribe`](../type-aliases/Unsubscribe.md)[]

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[State.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L85)

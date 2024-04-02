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

[State.ts:41](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L41)

## Properties

### signal

> **signal**: [`SignalObject`](../type-aliases/SignalObject.md)\<`S`\>

#### Source

[State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): `S`

#### Returns

`S`

#### Source

[State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L102)

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

[State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L104)

***

### on()

> **on**(`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• **sub**

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Source

[State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L127)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`S`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Source

[State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L96)

***

### use()

> **use**(...`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• ...**sub**: [`Unsubscribe`](../type-aliases/Unsubscribe.md)[]

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Source

[State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L124)

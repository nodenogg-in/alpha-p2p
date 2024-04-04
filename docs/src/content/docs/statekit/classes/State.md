---
editUrl: false
next: false
prev: false
title: "State"
---

## Type parameters

• **S** extends `object`

• **K** extends `string` & keyof `S` = `string` & keyof `S`

## Implements

- [`SignalState`](../interfaces/SignalState.md)\<`S`, `K`\>

## Constructors

### new State(__namedParameters)

> **new State**\<`S`, `K`\>(`__namedParameters`): [`State`](State.md)\<`S`, `K`\>

#### Parameters

• **\_\_namedParameters**: [`StateOptions`](../type-aliases/StateOptions.md)\<`S`\>

#### Returns

[`State`](State.md)\<`S`, `K`\>

#### Source

[State.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L29)

## Properties

### id

> **`readonly`** **id**: `string`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`id`](../interfaces/SignalState.md#id)

#### Source

[State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L22)

***

### signal

> **signal**: [`SignalObject`](../type-aliases/SignalObject.md)\<`S`\>

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`signal`](../interfaces/SignalState.md#signal)

#### Source

[State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L23)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`dispose`](../interfaces/SignalState.md#dispose)

#### Source

[State.ts:76](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L76)

***

### get()

> **get**(): `S`

#### Returns

`S`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`get`](../interfaces/SignalState.md#get)

#### Source

[State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L68)

***

### key()

> **key**\<`Key`\>(`k`): [`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Type parameters

• **Key** extends `string` = `K`

#### Parameters

• **k**: `Key`

#### Returns

[`Signal`](../type-aliases/Signal.md)\<`S`\[`Key`\]\>

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`key`](../interfaces/SignalState.md#key)

#### Source

[State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L70)

***

### on()

> **on**(`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• **sub**

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`on`](../interfaces/SignalState.md#on)

#### Source

[State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L73)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`resetInitial`](../interfaces/SignalState.md#resetinitial)

#### Source

[State.ts:93](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L93)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`S`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`set`](../interfaces/SignalState.md#set)

#### Source

[State.ts:62](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L62)

***

### use()

> **use**(...`sub`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Parameters

• ...**sub**: [`Unsubscribe`](../type-aliases/Unsubscribe.md)[]

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`use`](../interfaces/SignalState.md#use)

#### Source

[State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L90)

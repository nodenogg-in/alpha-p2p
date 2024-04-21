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

[State.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L29)

## Properties

### id

> **`readonly`** **id**: `string`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`id`](../interfaces/SignalState.md#id)

#### Source

[State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => [`Signal`](../type-aliases/Signal.md)\<`S`\[`K`\]\>

#### Type parameters

• **K** extends `string` \| `number` \| `symbol`

#### Parameters

• **key**: `K`

#### Returns

[`Signal`](../type-aliases/Signal.md)\<`S`\[`K`\]\>

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`key`](../interfaces/SignalState.md#key)

#### Source

[State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `S` \| `Partial`\<`S`\> \| (`state`) => `S` \| `Partial`\<`S`\>

• **sync?**: `boolean`

#### Returns

`void`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`set`](../interfaces/SignalState.md#set)

#### Source

[State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: [`SignalObject`](../interfaces/SignalObject.md)\<`S`, keyof `S`\>

#### Source

[State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

[State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L65)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`dispose`](../interfaces/SignalState.md#dispose)

#### Source

[State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L73)

***

### get()

> **get**(): `S`

#### Returns

`S`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`get`](../interfaces/SignalState.md#get)

#### Source

[State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

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

[State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L70)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Implementation of

[`SignalState`](../interfaces/SignalState.md).[`reset`](../interfaces/SignalState.md#reset)

#### Source

[State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L90)

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

[State.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L87)

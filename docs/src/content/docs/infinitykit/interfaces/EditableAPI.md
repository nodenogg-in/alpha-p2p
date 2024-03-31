---
editUrl: false
next: false
prev: false
title: "EditableAPI"
---

## Extends

- [`API`](API.md)

## Properties

### boxes()

> **boxes**: () => [`BoxReference`](../type-aliases/BoxReference.md)[]

#### Returns

[`BoxReference`](../type-aliases/BoxReference.md)[]

#### Inherited from

[`API`](API.md).[`boxes`](API.md#boxes)

#### Source

[packages/infinitykit/src/InfinityKit.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L12)

***

### create()

> **create**: (`boxes`) => `void`

#### Parameters

• **boxes**: [`Box`](../type-aliases/Box.md)[]

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L16)

***

### signal

> **signal**: `SignalObject`\<`any`\>

#### Inherited from

[`API`](API.md).[`signal`](API.md#signal)

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`API`](API.md).[`dispose`](API.md#dispose)

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): `any`

#### Returns

`any`

#### Inherited from

[`API`](API.md).[`get`](API.md#get)

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L102)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`any`\>

#### Type parameters

• **Key** extends `string` = `string`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<`any`\>

#### Inherited from

[`API`](API.md).[`key`](API.md#key)

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L104)

***

### on()

> **on**(`sub`): `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

[`API`](API.md).[`on`](API.md#on)

#### Source

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

[`API`](API.md).[`resetInitial`](API.md#resetinitial)

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L127)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`any`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

[`API`](API.md).[`set`](API.md#set)

#### Source

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L96)

***

### use()

> **use**(...`sub`): `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

[`API`](API.md).[`use`](API.md#use)

#### Source

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L124)

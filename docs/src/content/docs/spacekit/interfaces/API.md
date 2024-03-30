---
editUrl: false
next: false
prev: false
title: "API"
---

## Extends

- `State`\<`any`\>

## Type parameters

• **B** extends [`BoxReference`](../type-aliases/BoxReference.md) = [`BoxReference`](../type-aliases/BoxReference.md)

## Properties

### boxes()

> **boxes**: () => `B`[]

#### Returns

`B`[]

#### Source

[packages/spacekit/src/SpaceKit.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L12)

***

### signal

> **signal**: `SignalObject`\<`any`\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): `any`

#### Returns

`any`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L102)

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

`State.key`

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L104)

***

### on()

> **on**(`sub`): `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

`State.on`

#### Source

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L127)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`any`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L96)

***

### use()

> **use**(...`sub`): `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

`State.use`

#### Source

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L124)

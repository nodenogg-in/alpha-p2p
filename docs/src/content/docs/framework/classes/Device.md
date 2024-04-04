---
editUrl: false
next: false
prev: false
title: "Device"
---

## Extends

- `State`\<[`DeviceState`](../type-aliases/DeviceState.md)\>

## Constructors

### new Device(persistenceName)

> **new Device**(`persistenceName`?): [`Device`](Device.md)

#### Parameters

• **persistenceName?**: `PersistenceName`

#### Returns

[`Device`](Device.md)

#### Overrides

`State<DeviceState>.constructor`

#### Source

[internal/framework/src/state/Device.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Device.ts#L19)

## Properties

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L22)

***

### signal

> **signal**: `SignalObject`\<[`DeviceState`](../type-aliases/DeviceState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L23)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:76](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L76)

***

### get()

> **get**(): [`DeviceState`](../type-aliases/DeviceState.md)

#### Returns

[`DeviceState`](../type-aliases/DeviceState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L68)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<[`DeviceState`](../type-aliases/DeviceState.md)\[`Key`\]\>

#### Type parameters

• **Key** extends `"online"` \| `"persistence"` \| `"safari"` \| `"chrome"` \| `"mobile"` = `"online"` \| `"persistence"` \| `"safari"` \| `"chrome"` \| `"mobile"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<[`DeviceState`](../type-aliases/DeviceState.md)\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L70)

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

[packages/statekit/src/State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L73)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:93](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L93)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<[`DeviceState`](../type-aliases/DeviceState.md)\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:62](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L62)

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

[packages/statekit/src/State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L90)

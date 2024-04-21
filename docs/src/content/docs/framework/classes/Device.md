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

[internal/framework/src/state/Device.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Device.ts#L19)

## Properties

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<[`DeviceState`](../type-aliases/DeviceState.md)\[`K`\]\>

#### Type parameters

• **K** extends keyof [`DeviceState`](../type-aliases/DeviceState.md)

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<[`DeviceState`](../type-aliases/DeviceState.md)\[`K`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: [`DeviceState`](../type-aliases/DeviceState.md) \| `Partial`\<[`DeviceState`](../type-aliases/DeviceState.md)\> \| (`state`) => [`DeviceState`](../type-aliases/DeviceState.md) \| `Partial`\<[`DeviceState`](../type-aliases/DeviceState.md)\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<[`DeviceState`](../type-aliases/DeviceState.md), keyof [`DeviceState`](../type-aliases/DeviceState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

[packages/statekit/src/State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L65)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L73)

***

### get()

> **get**(): [`DeviceState`](../type-aliases/DeviceState.md)

#### Returns

[`DeviceState`](../type-aliases/DeviceState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

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

[packages/statekit/src/State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L70)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Inherited from

`State.reset`

#### Source

[packages/statekit/src/State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L90)

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

[packages/statekit/src/State.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L87)

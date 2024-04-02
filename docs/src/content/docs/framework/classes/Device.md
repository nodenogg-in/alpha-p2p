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

[internal/framework/src/state/Device.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/internal/framework/src/state/Device.ts#L19)

## Properties

### signal

> **signal**: `SignalObject`\<[`DeviceState`](../type-aliases/DeviceState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): [`DeviceState`](../type-aliases/DeviceState.md)

#### Returns

[`DeviceState`](../type-aliases/DeviceState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L102)

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

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L127)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L96)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/State.ts#L124)

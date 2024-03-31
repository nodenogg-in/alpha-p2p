---
editUrl: false
next: false
prev: false
title: "UI"
---

## Extends

- `State`\<[`UIState`](../type-aliases/UIState.md)\>

## Constructors

### new UI(persistenceName)

> **new UI**(`persistenceName`?): [`UI`](UI.md)

#### Parameters

• **persistenceName?**: `PersistenceName`

#### Returns

[`UI`](UI.md)

#### Overrides

`State<UIState>.constructor`

#### Source

[internal/framework/src/state/UI.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L29)

## Properties

### device

> **`readonly`** **device**: [`Device`](Device.md)

#### Source

[internal/framework/src/state/UI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L18)

***

### filedrop

> **`readonly`** **filedrop**: `FileDrop`

#### Source

[internal/framework/src/state/UI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L19)

***

### keyboard

> **`readonly`** **keyboard**: [`Keyboard`](Keyboard.md)

#### Source

[internal/framework/src/state/UI.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L17)

***

### screen

> **`readonly`** **screen**: [`Screen`](Screen.md)

#### Source

[internal/framework/src/state/UI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L20)

***

### signal

> **signal**: `SignalObject`\<[`UIState`](../type-aliases/UIState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): [`UIState`](../type-aliases/UIState.md)

#### Returns

[`UIState`](../type-aliases/UIState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L102)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<[`UIState`](../type-aliases/UIState.md)\[`Key`\]\>

#### Type parameters

• **Key** extends `"filterEvents"` \| `"menuOpen"` \| `"showUI"` = `"filterEvents"` \| `"menuOpen"` \| `"showUI"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<[`UIState`](../type-aliases/UIState.md)\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L127)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<[`UIState`](../type-aliases/UIState.md)\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L96)

***

### toggleMenu()

> **toggleMenu**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:62](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L62)

***

### toggleUI()

> **toggleUI**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/UI.ts#L65)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L124)

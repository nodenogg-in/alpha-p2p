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

[internal/framework/src/state/UI.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L29)

## Properties

### device

> **`readonly`** **device**: [`Device`](Device.md)

#### Source

[internal/framework/src/state/UI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L18)

***

### filedrop

> **`readonly`** **filedrop**: `FileDrop`

#### Source

[internal/framework/src/state/UI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L19)

***

### keyboard

> **`readonly`** **keyboard**: [`Keyboard`](Keyboard.md)

#### Source

[internal/framework/src/state/UI.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L17)

***

### screen

> **`readonly`** **screen**: [`Screen`](Screen.md)

#### Source

[internal/framework/src/state/UI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L20)

***

### signal

> **signal**: `SignalObject`\<[`UIState`](../type-aliases/UIState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L19)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:71](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L71)

***

### get()

> **get**(): [`UIState`](../type-aliases/UIState.md)

#### Returns

[`UIState`](../type-aliases/UIState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L63)

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

[packages/statekit/src/State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L65)

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

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L68)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:88](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L88)

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

[packages/statekit/src/State.ts:57](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L57)

***

### toggleMenu()

> **toggleMenu**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:62](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L62)

***

### toggleUI()

> **toggleUI**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/UI.ts#L65)

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

[packages/statekit/src/State.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L85)

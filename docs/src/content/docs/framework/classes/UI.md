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

[internal/framework/src/state/UI.ts:30](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L30)

## Properties

### device

> **`readonly`** **device**: [`Device`](Device.md)

#### Source

[internal/framework/src/state/UI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L19)

***

### filedrop

> **`readonly`** **filedrop**: `FileDrop`

#### Source

[internal/framework/src/state/UI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L20)

***

### filterEvents

> **`readonly`** **filterEvents**: `Signal`\<`boolean`\>

#### Source

[internal/framework/src/state/UI.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L16)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<[`UIState`](../type-aliases/UIState.md)\[`K`\]\>

#### Type parameters

• **K** extends keyof [`UIState`](../type-aliases/UIState.md)

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<[`UIState`](../type-aliases/UIState.md)\[`K`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### keyboard

> **`readonly`** **keyboard**: [`Keyboard`](Keyboard.md)

#### Source

[internal/framework/src/state/UI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L18)

***

### screen

> **`readonly`** **screen**: [`Screen`](Screen.md)

#### Source

[internal/framework/src/state/UI.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L21)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: [`UIState`](../type-aliases/UIState.md) \| `Partial`\<[`UIState`](../type-aliases/UIState.md)\> \| (`state`) => [`UIState`](../type-aliases/UIState.md) \| `Partial`\<[`UIState`](../type-aliases/UIState.md)\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<[`UIState`](../type-aliases/UIState.md), keyof [`UIState`](../type-aliases/UIState.md)\>

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

> **get**(): [`UIState`](../type-aliases/UIState.md)

#### Returns

[`UIState`](../type-aliases/UIState.md)

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

### toggleMenu()

> **toggleMenu**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L61)

***

### toggleUI()

> **toggleUI**(): `void`

#### Returns

`void`

#### Source

[internal/framework/src/state/UI.ts:64](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/UI.ts#L64)

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

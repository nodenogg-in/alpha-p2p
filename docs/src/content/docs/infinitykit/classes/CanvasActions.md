---
editUrl: false
next: false
prev: false
title: "CanvasActions"
---

## Extends

- `State`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

## Type parameters

• **T** extends [`ToolSet`](../type-aliases/ToolSet.md)

• **C** extends [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

• **A** extends [`API`](../interfaces/API.md) = [`API`](../interfaces/API.md)

## Constructors

### new CanvasActions(kit)

> **new CanvasActions**\<`T`, `C`, `A`\>(`kit`): [`CanvasActions`](CanvasActions.md)\<`T`, `C`, `A`\>

#### Parameters

• **kit**: `C`

#### Returns

[`CanvasActions`](CanvasActions.md)\<`T`, `C`, `A`\>

#### Overrides

`State<CanvasActionsState>.constructor`

#### Source

[packages/infinitykit/src/CanvasActions.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L92)

## Properties

### events

> **events**: `Events`\<[`InfinityKitEvents`](../type-aliases/InfinityKitEvents.md), `"create"`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L90)

***

### selectionGroup

> **selectionGroup**: `Signal`\<`SelectionBox`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:89](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L89)

***

### signal

> **signal**: `SignalObject`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

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

### finish()

> **finish**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:214](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L214)

***

### get()

> **get**(): [`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Returns

[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L63)

***

### is()

> **is**(`state`): `boolean`

#### Parameters

• **state**: `ActionState`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/CanvasActions.ts:115](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L115)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`Key`\]\>

#### Type parameters

• **Key** extends `"state"` \| `"tool"` \| `"edge"` \| `"selection"` \| `"highlight"` = `"state"` \| `"tool"` \| `"edge"` \| `"selection"` \| `"highlight"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`Key`\]\>

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

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L110)

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

### rest()

> **rest**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:117](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L117)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:57](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L57)

***

### start()

> **start**(`ps`): `void`

#### Parameters

• **ps**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:120](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L120)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:167](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/infinitykit/src/CanvasActions.ts#L167)

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

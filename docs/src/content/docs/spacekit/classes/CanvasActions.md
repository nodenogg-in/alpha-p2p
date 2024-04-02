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

[packages/infinitykit/src/CanvasActions.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L92)

## Properties

### events

> **events**: `Events`\<[`InfinityKitEvents`](../type-aliases/InfinityKitEvents.md), `"create"`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L90)

***

### selectionGroup

> **selectionGroup**: `Signal`\<`SelectionBox`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:89](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L89)

***

### signal

> **signal**: `SignalObject`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L33)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L110)

***

### finish()

> **finish**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:216](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L216)

***

### get()

> **get**(): [`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Returns

[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L102)

***

### is()

> **is**(`state`): `boolean`

#### Parameters

• **state**: `ActionState`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/CanvasActions.ts:117](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L117)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`Key`\]\>

#### Type parameters

• **Key** extends `"state"` \| `"highlight"` \| `"selection"` \| `"tool"` \| `"edge"` = `"state"` \| `"highlight"` \| `"selection"` \| `"tool"` \| `"edge"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L107)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:112](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L112)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L127)

***

### rest()

> **rest**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:119](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L119)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L96)

***

### start()

> **start**(`ps`): `void`

#### Parameters

• **ps**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:122](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L122)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:169](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/infinitykit/src/CanvasActions.ts#L169)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/fd5f5c9/packages/statekit/src/State.ts#L124)

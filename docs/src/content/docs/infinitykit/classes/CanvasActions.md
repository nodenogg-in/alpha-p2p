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

[packages/infinitykit/src/CanvasActions.ts:135](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L135)

## Properties

### events

> **events**: `Events`\<[`InfinityKitEvents`](../type-aliases/InfinityKitEvents.md), `"create"`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:132](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L132)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`K`\]\>

#### Type parameters

• **K** extends keyof [`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\[`K`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### machine

> **machine**: `SignalMachine`\<`"idle"` \| `"brushing"` \| `"moving"` \| `"resizing"` \| `"drawing-node"` \| `"drawing-region"`, `"resize"` \| `"move"` \| `"brush"` \| `"draw-node"` \| `"draw-region"` \| `"finish"`, `Object`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:133](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L133)

***

### selectionGroup

> **selectionGroup**: `Signal`\<`SelectionBox`\>

#### Source

[packages/infinitykit/src/CanvasActions.ts:131](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L131)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: [`CanvasActionsState`](../type-aliases/CanvasActionsState.md) \| `Partial`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\> \| (`state`) => [`CanvasActionsState`](../type-aliases/CanvasActionsState.md) \| `Partial`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<[`CanvasActionsState`](../type-aliases/CanvasActionsState.md), keyof [`CanvasActionsState`](../type-aliases/CanvasActionsState.md)\>

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

### finish()

> **finish**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:266](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L266)

***

### get()

> **get**(): [`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Returns

[`CanvasActionsState`](../type-aliases/CanvasActionsState.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

***

### is()

> **is**(`state`): `boolean`

#### Parameters

• **state**: `ActionState`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/CanvasActions.ts:158](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L158)

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

#### Overrides

`State.reset`

#### Source

[packages/infinitykit/src/CanvasActions.ts:153](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L153)

***

### rest()

> **rest**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:160](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L160)

***

### start()

> **start**(`ps`): `void`

#### Parameters

• **ps**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:163](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L163)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/CanvasActions.ts:214](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/CanvasActions.ts#L214)

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

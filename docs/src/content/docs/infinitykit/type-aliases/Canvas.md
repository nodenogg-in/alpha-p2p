---
editUrl: false
next: false
prev: false
title: "Canvas"
---

> **Canvas**: `Object`

## Type declaration

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### getHighlight()

> **getHighlight**: (`pointer`) => [`CanvasActionsState`](CanvasActionsState.md)\[`"highlight"`\]

#### Parameters

• **pointer**: `PointerState`

#### Returns

[`CanvasActionsState`](CanvasActionsState.md)\[`"highlight"`\]

### getSelection()

> **getSelection**: (`{ point, box }`, `boxes`?, `padding`?) => [`CanvasActionsState`](CanvasActionsState.md)\[`"selection"`\]

#### Parameters

• **\{ point, box }**: [`CanvasActionsState`](CanvasActionsState.md)\[`"highlight"`\]

• **boxes?**: [`BoxReference`](BoxReference.md)[]

• **padding?**: `number`

#### Returns

[`CanvasActionsState`](CanvasActionsState.md)\[`"selection"`\]

### getViewCenter()

> **getViewCenter**: () => `Vector2`

#### Returns

`Vector2`

### move()

> **move**: (`delta`) => `void`

#### Parameters

• **delta**: `Vector2`

#### Returns

`void`

### pan()

> **pan**: (`delta`) => `void`

#### Parameters

• **delta**: `Vector2`

#### Returns

`void`

### pinch()

> **pinch**: (`newDistance`) => `void`

#### Parameters

• **newDistance**: `number`

#### Returns

`void`

### relativeToContainer()

> **relativeToContainer**: \<`T`\>(`point`) => `T`

#### Type parameters

• **T** extends `Box` \| `Vector2`

#### Parameters

• **point**: `T`

#### Returns

`T`

### resize()

> **resize**: (`v`) => `void`

#### Parameters

• **v**: `Box`

#### Returns

`void`

### scroll()

> **scroll**: (`point`, `delta`, `multiplier`?) => `void`

#### Parameters

• **point**: `Vector2`

• **delta**: `Vector2`

• **multiplier?**: `number`

#### Returns

`void`

### snapToGrid()

> **snapToGrid**: (`canvas`, `value`) => `number`

#### Parameters

• **canvas**: [`CanvasState`](CanvasState.md)

• **value**: `number`

#### Returns

`number`

### state

> **state**: `SignalObject`\<[`CanvasState`](CanvasState.md)\>

### transform

> **transform**: `SignalCanvasMatrix`

### viewport

> **viewport**: `Signal`\<`Box`\>

### zoom()

> **zoom**: (`newScale`, `pivot`?) => `void`

#### Parameters

• **newScale**: `number`

• **pivot?**: `Vector2`

#### Returns

`void`

### zoomIn()

> **zoomIn**: () => `void`

#### Returns

`void`

### zoomOut()

> **zoomOut**: () => `void`

#### Returns

`void`

## Source

[create-canvas.ts:211](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/infinitykit/src/create-canvas.ts#L211)

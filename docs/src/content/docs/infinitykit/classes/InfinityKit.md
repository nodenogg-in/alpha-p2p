---
editUrl: false
next: false
prev: false
title: "InfinityKit"
---

## Type parameters

• **A** extends [`API`](../interfaces/API.md) = [`API`](../interfaces/API.md)

• **T** extends [`ToolSet`](../type-aliases/ToolSet.md) = [`ToolSet`](../type-aliases/ToolSet.md)

## Constructors

### new InfinityKit(api, __namedParameters)

> **new InfinityKit**\<`A`, `T`\>(`api`, `__namedParameters`): [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

#### Parameters

• **api**: `A`

• **\_\_namedParameters**

• **\_\_namedParameters\.canvas?**: [`CanvasOptions`](../type-aliases/CanvasOptions.md)= `{}`

• **\_\_namedParameters\.tools**: `T`

#### Returns

[`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

#### Source

[InfinityKit.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L27)

## Properties

### action

> **action**: [`CanvasActions`](../type-aliases/CanvasActions.md)

#### Source

[InfinityKit.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L23)

***

### api

> **`readonly`** **api**: `A`

#### Source

[InfinityKit.ts:28](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L28)

***

### interaction

> **interaction**: [`Canvas`](../type-aliases/Canvas.md)

#### Source

[InfinityKit.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L22)

***

### state

> **state**: `SignalObject`\<`Object`, `"focused"`\>

#### Type declaration

##### focused

> **focused**: `boolean` = `false`

#### Source

[InfinityKit.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L25)

***

### subscriptions

> **subscriptions**: `Subscriptions`\<`Subscription`\<`any`\>\>

#### Source

[InfinityKit.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L21)

***

### tools

> **`readonly`** **tools**: `T`

#### Source

[InfinityKit.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L24)

## Methods

### dispose()

> **dispose**(): `void`

#### Returns

`void`

#### Source

[InfinityKit.ts:114](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L114)

***

### hasTool()

> **hasTool**(`tool`): `boolean`

#### Parameters

• **tool**: keyof `T`

#### Returns

`boolean`

#### Source

[InfinityKit.ts:40](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L40)

***

### isBoxWithinViewport()

> **isBoxWithinViewport**\<`B`\>(`box`): `boolean`

#### Type parameters

• **B** extends [`BoxReference`](../type-aliases/BoxReference.md)

#### Parameters

• **box**: `B`

#### Returns

`boolean`

#### Source

[InfinityKit.ts:108](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L108)

***

### isTool()

> **isTool**(...`tools`): `boolean`

#### Parameters

• ...**tools**: keyof `T`[]

#### Returns

`boolean`

#### Source

[InfinityKit.ts:51](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L51)

***

### onFocus()

> **onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Source

[InfinityKit.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L100)

***

### onPointerDown()

> **onPointerDown**(`pointerState`, `e`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

• **e**: `PointerEvent`

#### Returns

`void`

#### Source

[InfinityKit.ts:89](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L89)

***

### onPointerOut()

> **onPointerOut**(): `void`

#### Returns

`void`

#### Source

[InfinityKit.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L85)

***

### onPointerOver()

> **onPointerOver**(): `void`

#### Returns

`void`

#### Source

[InfinityKit.ts:82](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L82)

***

### onPointerUp()

> **onPointerUp**(`pointerState`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[InfinityKit.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L96)

***

### onWheel()

> **onWheel**(`e`): `void`

#### Parameters

• **e**: `WheelEvent`

#### Returns

`void`

#### Source

[InfinityKit.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L54)

***

### select()

> **select**(`boxes`): `void`

#### Parameters

• **boxes**: `string`[]= `undefined`

#### Returns

`void`

#### Source

[InfinityKit.ts:48](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L48)

***

### setTool()

> **setTool**(`tool`): `void`

#### Parameters

• **tool**: keyof `T`

#### Returns

`void`

#### Source

[InfinityKit.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L42)

***

### toolbar()

> **toolbar**(): [keyof `T`, `ValueOf`\<`T`\>][]

#### Returns

[keyof `T`, `ValueOf`\<`T`\>][]

#### Source

[InfinityKit.ts:38](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L38)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[InfinityKit.ts:76](https://github.com/nodenogg-in/alpha-p2p/blob/920eddf19cd5eb07c362d64c8ceeef67e0a2790c/packages/infinitykit/src/InfinityKit.ts#L76)

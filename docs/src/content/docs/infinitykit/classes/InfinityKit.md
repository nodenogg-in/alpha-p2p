---
editUrl: false
next: false
prev: false
title: "InfinityKit"
---

## Extends

- `State`\<`Object`\>

## Type parameters

• **A** extends [`API`](../interfaces/API.md) = [`API`](../interfaces/API.md)

• **T** extends [`ToolSet`](../type-aliases/ToolSet.md) = [`ToolSet`](../type-aliases/ToolSet.md)

## Constructors

### new InfinityKit(api, __namedParameters)

> **new InfinityKit**\<`A`, `T`\>(`api`, `__namedParameters`): [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

#### Parameters

• **api**: `A`

• **\_\_namedParameters**

• **\_\_namedParameters\.canvas?**: [`CanvasInteractionOptions`](../type-aliases/CanvasInteractionOptions.md)= `{}`

• **\_\_namedParameters\.tools**: `T`

#### Returns

[`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

#### Overrides

`State<{
  focused: boolean
}>.constructor`

#### Source

[packages/infinitykit/src/InfinityKit.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L26)

## Properties

### action

> **action**: [`CanvasActions`](CanvasActions.md)\<`T`, [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>, [`API`](../interfaces/API.md)\<[`BoxReference`](../type-aliases/BoxReference.md)\>\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L23)

***

### api

> **`readonly`** **api**: `A`

#### Source

[packages/infinitykit/src/InfinityKit.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L27)

***

### interaction

> **interaction**: [`CanvasInteraction`](CanvasInteraction.md)

#### Source

[packages/infinitykit/src/InfinityKit.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L22)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### focused

> **focused**: `boolean`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L33)

***

### styles

> **`readonly`** **styles**: `Signal`\<[`CanvasStyle`](../type-aliases/CanvasStyle.md)\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L24)

***

### tools

> **`readonly`** **tools**: `T`

#### Source

[packages/infinitykit/src/InfinityKit.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L25)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): `Object`

#### Returns

`Object`

##### focused

> **focused**: `boolean`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L102)

***

### hasTool()

> **hasTool**(`tool`): `boolean`

#### Parameters

• **tool**: keyof `T`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:46](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L46)

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

[packages/infinitykit/src/InfinityKit.ts:113](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L113)

***

### isTool()

> **isTool**(...`tools`): `boolean`

#### Parameters

• ...**tools**: keyof `T`[]

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:57](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L57)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"focused"` = `"focused"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<`Object`\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L107)

***

### onFocus()

> **onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:105](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L105)

***

### onPointerDown()

> **onPointerDown**(`pointerState`, `e`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

• **e**: `PointerEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L94)

***

### onPointerOut()

> **onPointerOut**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L90)

***

### onPointerOver()

> **onPointerOver**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L87)

***

### onPointerUp()

> **onPointerUp**(`pointerState`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:101](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L101)

***

### onWheel()

> **onWheel**(`e`): `void`

#### Parameters

• **e**: `WheelEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:59](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L59)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L127)

***

### select()

> **select**(`boxes`): `void`

#### Parameters

• **boxes**: `string`[]= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L54)

***

### set()

> **set**(`u`, `sync`): `void`

#### Parameters

• **u**: `Partial`\<`Object`\>

• **sync**: `boolean`= `true`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L96)

***

### setTool()

> **setTool**(`tool`): `void`

#### Parameters

• **tool**: keyof `T`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:48](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L48)

***

### toolbar()

> **toolbar**(): [keyof `T`, `ValueOf`\<`T`\>][]

#### Returns

[keyof `T`, `ValueOf`\<`T`\>][]

#### Source

[packages/infinitykit/src/InfinityKit.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L44)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/infinitykit/src/InfinityKit.ts#L81)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/State.ts#L124)

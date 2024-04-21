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

• **\_\_namedParameters\.canvas?**: [`CanvasOptions`](../type-aliases/CanvasOptions.md)= `{}`

• **\_\_namedParameters\.tools**: `T`

#### Returns

[`InfinityKit`](InfinityKit.md)\<`A`, `T`\>

#### Overrides

`State<{
  focused: boolean
}>.constructor`

#### Source

[packages/infinitykit/src/InfinityKit.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L25)

## Properties

### action

> **action**: [`CanvasActions`](CanvasActions.md)\<`T`, [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>, [`API`](../interfaces/API.md)\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L22)

***

### api

> **`readonly`** **api**: `A`

#### Source

[packages/infinitykit/src/InfinityKit.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L26)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### interaction

> **interaction**: [`Canvas`](Canvas.md)

#### Source

[packages/infinitykit/src/InfinityKit.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L21)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<`Object`\[`K`\]\>

#### Type parameters

• **K** extends `"focused"`

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<`Object`\[`K`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `Object` \| `Partial`\<`Object`\> \| (`state`) => `Object` \| `Partial`\<`Object`\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<`Object`, `"focused"`\>

#### Type declaration

##### focused

> **focused**: `boolean`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

***

### tools

> **`readonly`** **tools**: `T`

#### Source

[packages/infinitykit/src/InfinityKit.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L23)

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

> **get**(): `Object`

#### Returns

`Object`

##### focused

> **focused**: `boolean`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

***

### hasTool()

> **hasTool**(`tool`): `boolean`

#### Parameters

• **tool**: keyof `T`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:43](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L43)

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

[packages/infinitykit/src/InfinityKit.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L110)

***

### isTool()

> **isTool**(...`tools`): `boolean`

#### Parameters

• ...**tools**: keyof `T`[]

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L54)

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

### onFocus()

> **onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L102)

***

### onPointerDown()

> **onPointerDown**(`pointerState`, `e`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

• **e**: `PointerEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:91](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L91)

***

### onPointerOut()

> **onPointerOut**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L87)

***

### onPointerOver()

> **onPointerOver**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:84](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L84)

***

### onPointerUp()

> **onPointerUp**(`pointerState`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:98](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L98)

***

### onWheel()

> **onWheel**(`e`): `void`

#### Parameters

• **e**: `WheelEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L56)

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

### select()

> **select**(`boxes`): `void`

#### Parameters

• **boxes**: `string`[]= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:51](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L51)

***

### setTool()

> **setTool**(`tool`): `void`

#### Parameters

• **tool**: keyof `T`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:45](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L45)

***

### toolbar()

> **toolbar**(): [keyof `T`, `ValueOf`\<`T`\>][]

#### Returns

[keyof `T`, `ValueOf`\<`T`\>][]

#### Source

[packages/infinitykit/src/InfinityKit.ts:41](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L41)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:78](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/InfinityKit.ts#L78)

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

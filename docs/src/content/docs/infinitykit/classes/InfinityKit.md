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

[packages/infinitykit/src/InfinityKit.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L29)

## Properties

### action

> **action**: [`CanvasActions`](CanvasActions.md)\<`T`, [`InfinityKit`](InfinityKit.md)\<`A`, `T`\>, [`API`](../interfaces/API.md)\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L26)

***

### api

> **`readonly`** **api**: `A`

#### Source

[packages/infinitykit/src/InfinityKit.ts:30](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L30)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L22)

***

### interaction

> **interaction**: [`Canvas`](Canvas.md)

#### Source

[packages/infinitykit/src/InfinityKit.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L25)

***

### machine

> **machine**: `SignalFSM`\<`"select"`, `never`\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L22)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### focused

> **focused**: `boolean`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L23)

***

### styles

> **`readonly`** **styles**: `Signal`\<[`CanvasStyle`](../type-aliases/CanvasStyle.md)\>

#### Source

[packages/infinitykit/src/InfinityKit.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L27)

***

### tools

> **`readonly`** **tools**: `T`

#### Source

[packages/infinitykit/src/InfinityKit.ts:28](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L28)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:76](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L76)

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

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L68)

***

### hasTool()

> **hasTool**(`tool`): `boolean`

#### Parameters

• **tool**: keyof `T`

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:52](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L52)

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

[packages/infinitykit/src/InfinityKit.ts:119](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L119)

***

### isTool()

> **isTool**(...`tools`): `boolean`

#### Parameters

• ...**tools**: keyof `T`[]

#### Returns

`boolean`

#### Source

[packages/infinitykit/src/InfinityKit.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L63)

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

[packages/statekit/src/State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L70)

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

[packages/statekit/src/State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L73)

***

### onFocus()

> **onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:111](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L111)

***

### onPointerDown()

> **onPointerDown**(`pointerState`, `e`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

• **e**: `PointerEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L100)

***

### onPointerOut()

> **onPointerOut**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L96)

***

### onPointerOver()

> **onPointerOver**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:93](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L93)

***

### onPointerUp()

> **onPointerUp**(`pointerState`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L107)

***

### onWheel()

> **onWheel**(`e`): `void`

#### Parameters

• **e**: `WheelEvent`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L65)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:93](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L93)

***

### select()

> **select**(`boxes`): `void`

#### Parameters

• **boxes**: `string`[]= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:60](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L60)

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

[packages/statekit/src/State.ts:62](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L62)

***

### setTool()

> **setTool**(`tool`): `void`

#### Parameters

• **tool**: keyof `T`

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L54)

***

### toolbar()

> **toolbar**(): [keyof `T`, `ValueOf`\<`T`\>][]

#### Returns

[keyof `T`, `ValueOf`\<`T`\>][]

#### Source

[packages/infinitykit/src/InfinityKit.ts:50](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L50)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/InfinityKit.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/InfinityKit.ts#L87)

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

[packages/statekit/src/State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L90)

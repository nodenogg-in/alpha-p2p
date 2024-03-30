---
editUrl: false
next: false
prev: false
title: "SpaceKit"
---

## Extends

- `State`\<`Object`\>

## Type parameters

• **A** extends [`API`](../interfaces/API.md) = [`API`](../interfaces/API.md)

• **T** extends [`ToolSet`](../type-aliases/ToolSet.md) = [`ToolSet`](../type-aliases/ToolSet.md)

## Constructors

### new SpaceKit(api, __namedParameters)

> **new SpaceKit**\<`A`, `T`\>(`api`, `__namedParameters`): [`SpaceKit`](SpaceKit.md)\<`A`, `T`\>

#### Parameters

• **api**: `A`

• **\_\_namedParameters**

• **\_\_namedParameters\.canvas?**: [`CanvasInteractionOptions`](../type-aliases/CanvasInteractionOptions.md)= `{}`

• **\_\_namedParameters\.tools**: `T`

#### Returns

[`SpaceKit`](SpaceKit.md)\<`A`, `T`\>

#### Overrides

`State<{
  focused: boolean
}>.constructor`

#### Source

[packages/spacekit/src/SpaceKit.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L26)

## Properties

### action

> **action**: [`CanvasActions`](CanvasActions.md)\<`T`, [`SpaceKit`](SpaceKit.md)\<`A`, `T`\>, [`API`](../interfaces/API.md)\<[`BoxReference`](../type-aliases/BoxReference.md)\>\>

#### Source

[packages/spacekit/src/SpaceKit.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L23)

***

### api

> **`readonly`** **api**: `A`

#### Source

[packages/spacekit/src/SpaceKit.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L27)

***

### interaction

> **interaction**: [`CanvasInteraction`](CanvasInteraction.md)

#### Source

[packages/spacekit/src/SpaceKit.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L22)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### focused

> **focused**: `boolean`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L33)

***

### styles

> **`readonly`** **styles**: `Signal`\<[`CanvasStyle`](../type-aliases/CanvasStyle.md)\>

#### Source

[packages/spacekit/src/SpaceKit.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L24)

***

### tools

> **`readonly`** **tools**: `T`

#### Source

[packages/spacekit/src/SpaceKit.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L25)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L110)

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

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L102)

***

### hasTool()

> **hasTool**(`tool`): `boolean`

#### Parameters

• **tool**: keyof `T`

#### Returns

`boolean`

#### Source

[packages/spacekit/src/SpaceKit.ts:47](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L47)

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

[packages/spacekit/src/SpaceKit.ts:114](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L114)

***

### isTool()

> **isTool**(...`tools`): `boolean`

#### Parameters

• ...**tools**: keyof `T`[]

#### Returns

`boolean`

#### Source

[packages/spacekit/src/SpaceKit.ts:58](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L58)

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

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L107)

***

### onFocus()

> **onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:106](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L106)

***

### onPointerDown()

> **onPointerDown**(`pointerState`, `e`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

• **e**: `PointerEvent`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:95](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L95)

***

### onPointerOut()

> **onPointerOut**(): `void`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:91](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L91)

***

### onPointerOver()

> **onPointerOver**(): `void`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:88](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L88)

***

### onPointerUp()

> **onPointerUp**(`pointerState`): `void`

#### Parameters

• **pointerState**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L102)

***

### onWheel()

> **onWheel**(`e`): `void`

#### Parameters

• **e**: `WheelEvent`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:60](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L60)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L127)

***

### select()

> **select**(`boxes`): `void`

#### Parameters

• **boxes**: `string`[]= `undefined`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:55](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L55)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L96)

***

### setTool()

> **setTool**(`tool`): `void`

#### Parameters

• **tool**: keyof `T`

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:49](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L49)

***

### toolbar()

> **toolbar**(): [keyof `T`, `ValueOf`\<`T`\>][]

#### Returns

[keyof `T`, `ValueOf`\<`T`\>][]

#### Source

[packages/spacekit/src/SpaceKit.ts:45](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L45)

***

### update()

> **update**(`pointer`): `void`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`void`

#### Source

[packages/spacekit/src/SpaceKit.ts:82](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/spacekit/src/SpaceKit.ts#L82)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/a4d5eff/packages/statekit/src/State.ts#L124)

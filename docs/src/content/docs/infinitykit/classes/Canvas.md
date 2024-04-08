---
editUrl: false
next: false
prev: false
title: "Canvas"
---

## Extends

- `State`\<[`CanvasState`](../type-aliases/CanvasState.md)\>

## Constructors

### new Canvas(__namedParameters)

> **new Canvas**(`__namedParameters`): [`Canvas`](Canvas.md)

#### Parameters

• **\_\_namedParameters**: [`CanvasOptions`](../type-aliases/CanvasOptions.md)

#### Returns

[`Canvas`](Canvas.md)

#### Overrides

`State<CanvasState>.constructor`

#### Source

[packages/infinitykit/src/Canvas.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L87)

## Properties

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<`Object`\[`K`\]\>

#### Type parameters

• **K** extends `RequiredKeys`\<`Object`, `EntriesOutput`\<`Object`\>\>

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

> **signal**: `SignalObject`\<`Object`, `RequiredKeys`\<`Object`, `EntriesOutput`\<`Object`\>\>\>

#### Type declaration

##### background

> **background**: `"dots"` \| `"lines"` \| `"none"` = `backgroundPattern`

##### bounds

> **bounds**: `Object` = `pointSchema`

##### bounds.x

> **x**: `number`

##### bounds.y

> **y**: `number`

##### cardOutline

> **cardOutline**: `number`

##### grid

> **grid**: `number`

##### loaded

> **loaded**: `boolean`

##### previous

> **previous**: `Object`

##### previous.distance

> **distance**: `number`

##### previous.transform

> **transform**: `Object` = `transformSchema`

##### previous.transform.scale

> **scale**: `number`

##### previous.transform.translate

> **translate**: `Object` = `pointSchema`

##### previous.transform.translate.x

> **x**: `number`

##### previous.transform.translate.y

> **y**: `number`

##### snapToGrid

> **snapToGrid**: `boolean`

##### transform

> **transform**: `Object` = `transformSchema`

##### transform.scale

> **scale**: `number`

##### transform.translate

> **translate**: `Object` = `pointSchema`

##### transform.translate.x

> **x**: `number`

##### transform.translate.y

> **y**: `number`

##### viewport

> **viewport**: `Object` & `Object` = `boxSchema`

###### Type declaration

###### x

> **x**: `number`

###### y

> **y**: `number`

###### Type declaration

###### height

> **height**: `number`

###### width

> **width**: `number`

##### zoom

> **zoom**: `Object`

##### zoom.increment

> **increment**: `number`

##### zoom.max

> **max**: `number`

##### zoom.min

> **min**: `number`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

***

### viewport

> **viewport**: `Signal`\<[`CanvasScreen`](../type-aliases/CanvasScreen.md)\<[`Box`](../type-aliases/Box.md)\>\>

#### Source

[packages/infinitykit/src/Canvas.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L85)

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

[packages/statekit/src/State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L65)

## Methods

### canvasToScreen()

> **canvasToScreen**\<`T`\>(`box`, `scaled`): `T` extends [`Box`](../type-aliases/Box.md) ? [`Box`](../type-aliases/Box.md) : `Object`

#### Type parameters

• **T** extends `Object`

#### Parameters

• **box**: `T`

• **scaled**: `boolean`= `true`

#### Returns

`T` extends [`Box`](../type-aliases/Box.md) ? [`Box`](../type-aliases/Box.md) : `Object`

#### Source

[packages/infinitykit/src/Canvas.ts:158](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L158)

***

### center()

> **center**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:357](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L357)

***

### centerAndZoomOnBox()

> **centerAndZoomOnBox**(`targetBox`): `void`

#### Parameters

• **targetBox**: [`Box`](../type-aliases/Box.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:322](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L322)

***

### centerViewAroundBox()

> **centerViewAroundBox**(`box`): `Object`

#### Parameters

• **box**: [`Box`](../type-aliases/Box.md)

#### Returns

`Object`

##### scale

> **scale**: `number`

##### translate

> **translate**: `Object` = `pointSchema`

##### translate.x

> **x**: `number`

##### translate.y

> **y**: `number`

#### Source

[packages/infinitykit/src/Canvas.ts:348](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L348)

***

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

##### background

> **background**: `"dots"` \| `"lines"` \| `"none"` = `backgroundPattern`

##### bounds

> **bounds**: `Object` = `pointSchema`

##### bounds.x

> **x**: `number`

##### bounds.y

> **y**: `number`

##### cardOutline

> **cardOutline**: `number`

##### grid

> **grid**: `number`

##### loaded

> **loaded**: `boolean`

##### previous

> **previous**: `Object`

##### previous.distance

> **distance**: `number`

##### previous.transform

> **transform**: `Object` = `transformSchema`

##### previous.transform.scale

> **scale**: `number`

##### previous.transform.translate

> **translate**: `Object` = `pointSchema`

##### previous.transform.translate.x

> **x**: `number`

##### previous.transform.translate.y

> **y**: `number`

##### snapToGrid

> **snapToGrid**: `boolean`

##### transform

> **transform**: `Object` = `transformSchema`

##### transform.scale

> **scale**: `number`

##### transform.translate

> **translate**: `Object` = `pointSchema`

##### transform.translate.x

> **x**: `number`

##### transform.translate.y

> **y**: `number`

##### viewport

> **viewport**: `Object` & `Object` = `boxSchema`

###### Type declaration

###### x

> **x**: `number`

###### y

> **y**: `number`

###### Type declaration

###### height

> **height**: `number`

###### width

> **width**: `number`

##### zoom

> **zoom**: `Object`

##### zoom.increment

> **increment**: `number`

##### zoom.max

> **max**: `number`

##### zoom.min

> **min**: `number`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

***

### getHighlight()

> **getHighlight**(`pointer`): `Object`

#### Parameters

• **pointer**: [`PointerState`](../type-aliases/PointerState.md)

#### Returns

`Object`

##### box

> **box**: [`CanvasScreen`](../type-aliases/CanvasScreen.md)\<[`Box`](../type-aliases/Box.md)\>

##### point

> **point**: [`CanvasScreen`](../type-aliases/CanvasScreen.md)\<`Object`\>

###### Type declaration

###### x

> **x**: `number`

###### y

> **y**: `number`

#### Source

[packages/infinitykit/src/Canvas.ts:197](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L197)

***

### getSelection()

> **getSelection**(`__namedParameters`, `boxes`, `padding`): `Object`

#### Parameters

• **\_\_namedParameters**

• **\_\_namedParameters\.box**: [`CanvasScreen`](../type-aliases/CanvasScreen.md)\<[`Box`](../type-aliases/Box.md)\>

• **\_\_namedParameters\.point**: [`CanvasScreen`](../type-aliases/CanvasScreen.md)\<`Object`\>

• **boxes**: [`BoxReference`](../type-aliases/BoxReference.md)[]= `[]`

• **padding**: `number`= `0`

#### Returns

`Object`

##### boxes

> **boxes**: `string`[]

##### target

> **target**: `null` \| `string`

#### Source

[packages/infinitykit/src/Canvas.ts:165](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L165)

***

### getTransform()

> **getTransform**(`newTransform`): `Object`

#### Parameters

• **newTransform**: `Partial`\<`Object`\>

#### Returns

`Object`

##### scale

> **scale**: `number`

##### translate

> **translate**: `Object` = `pointSchema`

##### translate.x

> **x**: `number`

##### translate.y

> **y**: `number`

#### Source

[packages/infinitykit/src/Canvas.ts:174](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L174)

***

### getViewCenter()

> **getViewCenter**(): `Object`

#### Returns

`Object`

##### x

> **x**: `number`

##### y

> **y**: `number`

#### Source

[packages/infinitykit/src/Canvas.ts:341](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L341)

***

### getZoom()

> **getZoom**(`delta`, `zoomIncrement`, `decimal`): `number`

#### Parameters

• **delta**: `number`

• **zoomIncrement**: `number`

• **decimal**: `number`= `4`

#### Returns

`number`

#### Source

[packages/infinitykit/src/Canvas.ts:136](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L136)

***

### move()

> **move**(`delta`): `void`

#### Parameters

• **delta**

• **delta\.x**: `number`= `undefined`

• **delta\.y**: `number`= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:264](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L264)

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

### pan()

> **pan**(`delta`): `void`

#### Parameters

• **delta**

• **delta\.x**: `number`= `undefined`

• **delta\.y**: `number`= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:276](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L276)

***

### pinch()

> **pinch**(`newDistance`): `void`

#### Parameters

• **newDistance**: `number`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:255](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L255)

***

### relativeToContainer()

> **relativeToContainer**\<`T`\>(`point`): `T`

#### Type parameters

• **T** extends `Object` \| [`Box`](../type-aliases/Box.md)

#### Parameters

• **point**: `T`

#### Returns

`T`

#### Source

[packages/infinitykit/src/Canvas.ts:143](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L143)

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

### resize()

> **resize**(`viewport`): `void`

#### Parameters

• **viewport**: [`Box`](../type-aliases/Box.md)

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:212](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L212)

***

### screenToCanvas()

> **screenToCanvas**\<`T`\>(`box`): `T` extends [`Box`](../type-aliases/Box.md) ? [`Box`](../type-aliases/Box.md) : `Object`

#### Type parameters

• **T** extends `Object`

#### Parameters

• **box**: `T`

#### Returns

`T` extends [`Box`](../type-aliases/Box.md) ? [`Box`](../type-aliases/Box.md) : `Object`

#### Source

[packages/infinitykit/src/Canvas.ts:152](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L152)

***

### scroll()

> **scroll**(`point`, `delta`, `multiplier`): `void`

#### Parameters

• **point**

• **point\.x**: `number`= `undefined`

• **point\.y**: `number`= `undefined`

• **delta**

• **delta\.x**: `number`= `undefined`

• **delta\.y**: `number`= `undefined`

• **multiplier**: `number`= `1`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:288](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L288)

***

### snapToGrid()

> **snapToGrid**(`canvas`, `value`): `number`

#### Parameters

• **canvas**

• **canvas\.background**: `"dots"` \| `"lines"` \| `"none"`= `backgroundPattern`

• **canvas\.bounds**= `pointSchema`

• **canvas\.bounds\.x**: `number`= `undefined`

• **canvas\.bounds\.y**: `number`= `undefined`

• **canvas\.cardOutline**: `number`= `undefined`

• **canvas\.grid**: `number`= `undefined`

• **canvas\.loaded**: `boolean`= `undefined`

• **canvas\.previous**= `undefined`

• **canvas\.previous\.distance**: `number`= `undefined`

• **canvas\.previous\.transform**= `transformSchema`

• **canvas\.previous\.transform\.scale**: `number`= `undefined`

• **canvas\.previous\.transform\.translate**= `pointSchema`

• **canvas\.previous\.transform\.translate\.x**: `number`= `undefined`

• **canvas\.previous\.transform\.translate\.y**: `number`= `undefined`

• **canvas\.snapToGrid**: `boolean`= `undefined`

• **canvas\.transform**= `transformSchema`

• **canvas\.transform\.scale**: `number`= `undefined`

• **canvas\.transform\.translate**= `pointSchema`

• **canvas\.transform\.translate\.x**: `number`= `undefined`

• **canvas\.transform\.translate\.y**: `number`= `undefined`

• **canvas\.viewport**: `Object` & `Object`= `boxSchema`

• **canvas\.zoom**= `undefined`

• **canvas\.zoom\.increment**: `number`= `undefined`

• **canvas\.zoom\.max**: `number`= `undefined`

• **canvas\.zoom\.min**: `number`= `undefined`

• **value**: `number`

#### Returns

`number`

#### Source

[packages/infinitykit/src/Canvas.ts:131](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L131)

***

### storeState()

> **storeState**(`distance`): `void`

#### Parameters

• **distance**: `number`= `0`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:319](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L319)

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

***

### zoom()

> **zoom**(`newScale`): `void`

#### Parameters

• **newScale**: `number`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:230](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L230)

***

### zoomAndTranslate()

> **zoomAndTranslate**(`direction`, `increment`): `Object`

#### Parameters

• **direction**: `number`= `1`

• **increment**: `number`= `undefined`

#### Returns

`Object`

##### scale

> **scale**: `number`

##### translate

> **translate**: `Object` = `pointSchema`

##### translate.x

> **x**: `number`

##### translate.y

> **y**: `number`

#### Source

[packages/infinitykit/src/Canvas.ts:218](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L218)

***

### zoomIn()

> **zoomIn**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:243](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L243)

***

### zoomOut()

> **zoomOut**(): `void`

#### Returns

`void`

#### Source

[packages/infinitykit/src/Canvas.ts:249](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L249)

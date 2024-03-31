---
editUrl: false
next: false
prev: false
title: "CanvasInteraction"
---

## Extends

- `State`\<[`CanvasInteractionState`](../type-aliases/CanvasInteractionState.md)\>

## Constructors

### new CanvasInteraction(__namedParameters)

> **new CanvasInteraction**(`__namedParameters`): [`CanvasInteraction`](CanvasInteraction.md)

#### Parameters

• **\_\_namedParameters**: [`CanvasInteractionOptions`](../type-aliases/CanvasInteractionOptions.md)

#### Returns

[`CanvasInteraction`](CanvasInteraction.md)

#### Overrides

`State<CanvasInteractionState>.constructor`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L86)

## Properties

### signal

> **signal**: `SignalObject`\<`Object`\>

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

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L33)

***

### viewport

> **viewport**: `Signal`\<[`CanvasScreen`](../type-aliases/CanvasScreen.md)\<[`Box`](../type-aliases/Box.md)\>\>

#### Source

[packages/spacekit/src/CanvasInteraction.ts:84](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L84)

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

[packages/spacekit/src/CanvasInteraction.ts:186](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L186)

***

### center()

> **center**(): `void`

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:404](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L404)

***

### centerAndZoomOnBox()

> **centerAndZoomOnBox**(`targetBox`): `void`

#### Parameters

• **targetBox**: [`Box`](../type-aliases/Box.md)

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:369](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L369)

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

[packages/spacekit/src/CanvasInteraction.ts:395](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L395)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L110)

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

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L102)

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

[packages/spacekit/src/CanvasInteraction.ts:256](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L256)

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

[packages/spacekit/src/CanvasInteraction.ts:224](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L224)

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

[packages/spacekit/src/CanvasInteraction.ts:233](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L233)

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

[packages/spacekit/src/CanvasInteraction.ts:388](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L388)

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

[packages/spacekit/src/CanvasInteraction.ts:135](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L135)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"bounds"` \| `"zoom"` \| `"viewport"` \| `"transform"` \| `"background"` \| `"previous"` \| `"cardOutline"` \| `"grid"` \| `"snapToGrid"` \| `"loaded"` = `"bounds"` \| `"zoom"` \| `"viewport"` \| `"transform"` \| `"background"` \| `"previous"` \| `"cardOutline"` \| `"grid"` \| `"snapToGrid"` \| `"loaded"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<`Object`\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L104)

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

[packages/spacekit/src/CanvasInteraction.ts:311](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L311)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L107)

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

[packages/spacekit/src/CanvasInteraction.ts:323](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L323)

***

### pinch()

> **pinch**(`newDistance`): `void`

#### Parameters

• **newDistance**: `number`

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:302](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L302)

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

[packages/spacekit/src/CanvasInteraction.ts:142](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L142)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L127)

***

### resize()

> **resize**(`viewport`): `void`

#### Parameters

• **viewport**: [`Box`](../type-aliases/Box.md)

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:271](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L271)

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

[packages/spacekit/src/CanvasInteraction.ts:151](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L151)

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

[packages/spacekit/src/CanvasInteraction.ts:335](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L335)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L96)

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

[packages/spacekit/src/CanvasInteraction.ts:130](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L130)

***

### storeState()

> **storeState**(`distance`): `void`

#### Parameters

• **distance**: `number`= `0`

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:366](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L366)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/State.ts#L124)

***

### zoom()

> **zoom**(`newScale`): `void`

#### Parameters

• **newScale**: `number`

#### Returns

`void`

#### Source

[packages/spacekit/src/CanvasInteraction.ts:289](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L289)

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

[packages/spacekit/src/CanvasInteraction.ts:277](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L277)

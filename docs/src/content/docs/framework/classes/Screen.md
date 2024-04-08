---
editUrl: false
next: false
prev: false
title: "Screen"
---

## Extends

- `State`\<`Object`\>

## Constructors

### new Screen(__namedParameters, target)

> **new Screen**(`__namedParameters`, `target`): [`Screen`](Screen.md)

#### Parameters

• **\_\_namedParameters**: `CreatePointer`= `{}`

• **target**: `DOMElement`= `window`

#### Returns

[`Screen`](Screen.md)

#### Overrides

`State<{ pointer: PointerState; screen: ScreenState }>.constructor`

#### Source

[internal/framework/src/state/Screen.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Screen.ts#L44)

## Properties

### filterEvents

> **filterEvents**: `EventFilter`

#### Source

[internal/framework/src/state/Screen.ts:41](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Screen.ts#L41)

***

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

• **K** extends `"pointer"` \| `"screen"`

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

> **signal**: `SignalObject`\<`Object`, `"pointer"` \| `"screen"`\>

#### Type declaration

##### pointer

> **pointer**: `PointerState`

##### screen

> **screen**: `ScreenState`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

***

### target

> **target**: `DOMElement`

#### Source

[internal/framework/src/state/Screen.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Screen.ts#L42)

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

##### pointer

> **pointer**: `PointerState`

##### screen

> **screen**: `ScreenState`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

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

#### Inherited from

`State.reset`

#### Source

[packages/statekit/src/State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L90)

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

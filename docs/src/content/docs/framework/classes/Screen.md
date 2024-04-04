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

[internal/framework/src/state/Screen.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Screen.ts#L44)

## Properties

### filterEvents

> **filterEvents**: `EventFilter`

#### Source

[internal/framework/src/state/Screen.ts:41](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Screen.ts#L41)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### pointer

> **pointer**: `PointerState`

##### screen

> **screen**: `ScreenState`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L19)

***

### target

> **target**: `DOMElement`

#### Source

[internal/framework/src/state/Screen.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Screen.ts#L42)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:71](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L71)

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

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L63)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"pointer"` \| `"screen"` = `"pointer"` \| `"screen"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<`Object`\[`Key`\]\>

#### Inherited from

`State.key`

#### Source

[packages/statekit/src/State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L65)

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

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L68)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:88](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L88)

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

[packages/statekit/src/State.ts:57](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L57)

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

[packages/statekit/src/State.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/packages/statekit/src/State.ts#L85)

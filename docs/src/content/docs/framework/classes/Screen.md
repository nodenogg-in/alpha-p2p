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

[internal/framework/src/state/Screen.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/Screen.ts#L44)

## Properties

### filterEvents

> **filterEvents**: `EventFilter`

#### Source

[internal/framework/src/state/Screen.ts:41](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/Screen.ts#L41)

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

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L33)

***

### target

> **target**: `DOMElement`

#### Source

[internal/framework/src/state/Screen.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/Screen.ts#L42)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L110)

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

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L102)

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

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L127)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L96)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/packages/statekit/src/State.ts#L124)

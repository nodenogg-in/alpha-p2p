---
editUrl: false
next: false
prev: false
title: "Session"
---

## Extends

- `State`\<[`SessionState`](../type-aliases/SessionState.md)\>

## Constructors

### new Session(persistanceName)

> **new Session**(`persistanceName`?): [`Session`](Session.md)

#### Parameters

• **persistanceName?**: `PersistenceName`

#### Returns

[`Session`](Session.md)

#### Overrides

`State<SessionState>.constructor`

#### Source

[internal/framework/src/state/Session.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L31)

## Properties

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L22)

***

### microcosms

> **microcosms**: `Signal`\<`Object`[]\>

#### Source

[internal/framework/src/state/Session.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L29)

***

### ready

> **ready**: `Signal`\<`boolean`\>

#### Source

[internal/framework/src/state/Session.ts:28](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L28)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### active?

> **`optional`** **active**: `string`

##### microcosms

> **microcosms**: `MapOutput`\<`SpecialSchema`\<`MicrocosmID`, `MicrocosmID`\>, `ObjectSchema`\<`Object`, `undefined`, `Object`\>\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L23)

***

### user

> **user**: [`User`](User.md)

#### Source

[internal/framework/src/state/Session.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L27)

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

##### active?

> **`optional`** **active**: `string`

##### microcosms

> **microcosms**: `MapOutput`\<`SpecialSchema`\<`MicrocosmID`, `MicrocosmID`\>, `ObjectSchema`\<`Object`, `undefined`, `Object`\>\>

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L68)

***

### getReference()

> **getReference**(`microcosmID`): `false` \| `Object`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`false` \| `Object`

#### Source

[internal/framework/src/state/Session.ts:72](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L72)

***

### isActive()

> **isActive**(`microcosmID`): `boolean`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`boolean`

#### Source

[internal/framework/src/state/Session.ts:80](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L80)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"active"` \| `"microcosms"` = `"active"` \| `"microcosms"`

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

### registerReference()

> **registerReference**(`__namedParameters`): `Object`

#### Parameters

• **\_\_namedParameters**: [`MicrocosmEntryRequest`](../type-aliases/MicrocosmEntryRequest.md)

#### Returns

`Object`

##### lastAccessed

> **lastAccessed**: `number`

##### microcosmID

> **microcosmID**: `MicrocosmID`

##### password?

> **`optional`** **password**: `string`

##### view?

> **`optional`** **view**: `string`

#### Source

[internal/framework/src/state/Session.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L54)

***

### removeReference()

> **removeReference**(`microcosmID`): `void`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`void`

#### Source

[internal/framework/src/state/Session.ts:46](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L46)

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

### setActive()

> **setActive**(`microcosmID`): `void`

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`void`

#### Source

[internal/framework/src/state/Session.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/Session.ts#L81)

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

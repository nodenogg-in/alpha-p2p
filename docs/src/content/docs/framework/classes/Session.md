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

[internal/framework/src/state/Session.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L31)

## Properties

### microcosms

> **microcosms**: `Signal`\<`Object`[]\>

#### Source

[internal/framework/src/state/Session.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L29)

***

### ready

> **ready**: `Signal`\<`boolean`\>

#### Source

[internal/framework/src/state/Session.ts:28](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L28)

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

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L33)

***

### user

> **user**: [`User`](User.md)

#### Source

[internal/framework/src/state/Session.ts:27](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L27)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L110)

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

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L102)

***

### getReference()

> **getReference**(`MicrocosmID`): `false` \| `Object`

#### Parameters

• **MicrocosmID**: `MicrocosmID`

#### Returns

`false` \| `Object`

#### Source

[internal/framework/src/state/Session.ts:72](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L72)

***

### isActive()

> **isActive**(`MicrocosmID`): `boolean`

#### Parameters

• **MicrocosmID**: `MicrocosmID`

#### Returns

`boolean`

#### Source

[internal/framework/src/state/Session.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L81)

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

[packages/statekit/src/State.ts:104](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L104)

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

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L107)

***

### registerReference()

> **registerReference**(`__namedParameters`): `Object`

#### Parameters

• **\_\_namedParameters**: [`MicrocosmEntryRequest`](../type-aliases/MicrocosmEntryRequest.md)

#### Returns

`Object`

##### MicrocosmID

> **MicrocosmID**: `MicrocosmID` = `microcosmURI`

##### lastAccessed

> **lastAccessed**: `number`

##### password?

> **`optional`** **password**: `string`

##### view?

> **`optional`** **view**: `string`

#### Source

[internal/framework/src/state/Session.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L54)

***

### removeReference()

> **removeReference**(`MicrocosmID`): `void`

#### Parameters

• **MicrocosmID**: `MicrocosmID`

#### Returns

`void`

#### Source

[internal/framework/src/state/Session.ts:46](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L46)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

`State.resetInitial`

#### Source

[packages/statekit/src/State.ts:127](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L127)

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

[packages/statekit/src/State.ts:96](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L96)

***

### setActive()

> **setActive**(`MicrocosmID`): `void`

#### Parameters

• **MicrocosmID**: `MicrocosmID`

#### Returns

`void`

#### Source

[internal/framework/src/state/Session.ts:82](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/Session.ts#L82)

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

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L124)

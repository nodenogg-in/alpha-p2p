---
editUrl: false
next: false
prev: false
title: "User"
---

## Extends

- `State`\<`Identity`\>

## Constructors

### new User()

> **new User**(): [`User`](User.md)

#### Returns

[`User`](User.md)

#### Overrides

`State<Identity>.constructor`

#### Source

[internal/framework/src/state/User.ts:7](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/state/User.ts#L7)

## Properties

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L22)

***

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### identityID

> **identityID**: ```identity_${string}```

##### username?

> **`optional`** **username**: `string`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L23)

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

##### identityID

> **identityID**: ```identity_${string}```

##### username?

> **`optional`** **username**: `string`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:68](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/State.ts#L68)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"identityID"` \| `"username"` = `"identityID"` \| `"username"`

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

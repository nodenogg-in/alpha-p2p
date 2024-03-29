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

[internal/framework/src/state/User.ts:7](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/framework/src/state/User.ts#L7)

## Properties

### signal

> **signal**: `SignalObject`\<`Object`\>

#### Type declaration

##### IdentityID

> **IdentityID**: ```identity_${string}``` = `identityUID`

##### username?

> **`optional`** **username**: `string`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L33)

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

##### IdentityID

> **IdentityID**: ```identity_${string}``` = `identityUID`

##### username?

> **`optional`** **username**: `string`

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L102)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<`Object`\[`Key`\]\>

#### Type parameters

• **Key** extends `"IdentityID"` \| `"username"` = `"IdentityID"` \| `"username"`

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

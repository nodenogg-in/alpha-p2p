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

[internal/framework/src/state/User.ts:7](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/User.ts#L7)

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

• **K** extends `"identityID"` \| `"username"`

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

> **signal**: `SignalObject`\<`Object`, `"identityID"` \| `"username"`\>

#### Type declaration

##### identityID

> **identityID**: ```identity_${string}```

##### username?

> **`optional`** **username**: `string`

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

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

##### identityID

> **identityID**: ```identity_${string}```

##### username?

> **`optional`** **username**: `string`

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

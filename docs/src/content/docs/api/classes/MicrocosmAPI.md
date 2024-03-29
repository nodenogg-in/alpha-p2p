---
editUrl: false
next: false
prev: false
title: "MicrocosmAPI"
---

## Extends

- `State`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

## Constructors

### new MicrocosmAPI(__namedParameters, telemetry)

> **new MicrocosmAPI**(`__namedParameters`, `telemetry`?): [`MicrocosmAPI`](MicrocosmAPI.md)

Creates a new Microcosm

#### Parameters

• **\_\_namedParameters**: [`MicrocosmAPIConfig`](../type-aliases/MicrocosmAPIConfig.md)

• **telemetry?**: `Telemetry`

#### Returns

[`MicrocosmAPI`](MicrocosmAPI.md)

#### Overrides

`State<MicrocosmAPIEvents>.constructor`

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:38](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L38)

## Properties

### MicrocosmID

> **`readonly`** **MicrocosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L31)

***

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L87)

***

### getCollection()

> **getCollection**: (`IdentityID`) => [`NodeReference`](../type-aliases/NodeReference.md)[]

Gets a snapshot of Nodes in a collection

#### Parameters

• **IdentityID**: ```identity_${string}```

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)[]

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:79](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L79)

***

### getCollections()

> **getCollections**: () => ```identity_${string}```[]

#### Returns

```identity_${string}```[]

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L70)

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L81)

***

### node()

> **node**: \<`T`\>(`NodeID`, `type`?) => `undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>

Retrieves a single [Node](../../../../../../api/type-aliases/node) by [NodeID](../../../../../../api/type-aliases/nodeid) and optional type

#### Type parameters

• **T** extends keyof [`NodeMap`](../type-aliases/NodeMap.md)

#### Parameters

• **NodeID**: ```node_${string}```

• **type?**: `T`

#### Returns

`undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:64](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L64)

***

### nodes()

> **nodes**: \<`T`\>(`type`?) => `T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

#### Type parameters

• **T** extends `undefined` \| keyof NodeMap = `undefined`

#### Parameters

• **type?**: `T`

#### Returns

`T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:66](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L66)

***

### signal

> **signal**: `SignalObject`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L33)

***

### subscribeToCollection()

> **subscribeToCollection**: (`IdentityID`) => `Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Parameters

• **IdentityID**: ```identity_${string}```

#### Returns

`Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:72](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L72)

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

> **get**(): [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Returns

[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L102)

***

### key()

> **key**\<`Key`\>(`k`): `Signal`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\[`Key`\]\>

#### Type parameters

• **Key** extends `"status"` \| `"active"` \| `"identities"` \| `"collections"` = `"status"` \| `"active"` \| `"identities"` \| `"collections"`

#### Parameters

• **k**: `Key`

#### Returns

`Signal`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\[`Key`\]\>

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

• **u**: `Partial`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

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

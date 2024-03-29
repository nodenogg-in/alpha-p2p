---
editUrl: false
next: false
prev: false
title: "EditableMicrocosmAPI"
---

## Extends

- [`MicrocosmAPI`](MicrocosmAPI.md)

## Constructors

### new EditableMicrocosmAPI(__namedParameters, telemetry)

> **new EditableMicrocosmAPI**(`__namedParameters`, `telemetry`?): [`EditableMicrocosmAPI`](EditableMicrocosmAPI.md)

Creates a new Microcosm

#### Parameters

• **\_\_namedParameters**: [`MicrocosmAPIConfig`](../type-aliases/MicrocosmAPIConfig.md)

• **telemetry?**: `Telemetry`

#### Returns

[`EditableMicrocosmAPI`](EditableMicrocosmAPI.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`constructor`](MicrocosmAPI.md#constructors)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:38](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L38)

## Properties

### MicrocosmID

> **`readonly`** **MicrocosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`MicrocosmID`](MicrocosmAPI.md#microcosmid)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L31)

***

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`boxes`](MicrocosmAPI.md#boxes)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L87)

***

### create()

> **create**: (`n`) => `Promise`\<`string` \| `string`[]\>

#### Parameters

• **n**: [`NewNode`](../type-aliases/NewNode.md) \| [`NewNode`](../type-aliases/NewNode.md)[]

#### Returns

`Promise`\<`string` \| `string`[]\>

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:6](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L6)

***

### delete()

> **delete**: (`NodeID`) => `void`

#### Parameters

• **NodeID**: ```node_${string}```

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:9](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L9)

***

### deleteAll()

> **deleteAll**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:10](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L10)

***

### destroy()

> **destroy**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:13](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L13)

***

### getCollection()

> **getCollection**: (`IdentityID`) => [`NodeReference`](../type-aliases/NodeReference.md)[]

Gets a snapshot of Nodes in a collection

#### Parameters

• **IdentityID**: ```identity_${string}```

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`getCollection`](MicrocosmAPI.md#getcollection)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:79](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L79)

***

### getCollections()

> **getCollections**: () => ```identity_${string}```[]

#### Returns

```identity_${string}```[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`getCollections`](MicrocosmAPI.md#getcollections)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L70)

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`isActive`](MicrocosmAPI.md#isactive)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L81)

***

### join()

> **join**: (`username`?) => `void`

#### Parameters

• **username?**: `string`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:11](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L11)

***

### leave()

> **leave**: (`username`?) => `void`

#### Parameters

• **username?**: `string`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L12)

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

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`node`](MicrocosmAPI.md#node)

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

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`nodes`](MicrocosmAPI.md#nodes)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:66](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L66)

***

### patch()

> **patch**: \<`T`\>(`NodeID`, `patch`) => `void`

#### Type parameters

• **T** extends keyof [`NodeMap`](../type-aliases/NodeMap.md)

#### Parameters

• **NodeID**: ```node_${string}```

• **patch**: [`NodePatch`](../type-aliases/NodePatch.md)\<`T`\>

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:7](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L7)

***

### redo()

> **redo**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:15](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L15)

***

### signal

> **signal**: `SignalObject`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`signal`](MicrocosmAPI.md#signal)

#### Source

[packages/statekit/src/State.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L33)

***

### subscribeToCollection()

> **subscribeToCollection**: (`IdentityID`) => `Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Parameters

• **IdentityID**: ```identity_${string}```

#### Returns

`Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`subscribeToCollection`](MicrocosmAPI.md#subscribetocollection)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:72](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/MicrocosmAPI.ts#L72)

***

### undo()

> **undo**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:14](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L14)

***

### update()

> **update**: \<`T`\>(...`u`) => `void`

#### Type parameters

• **T** extends keyof [`NodeMap`](../type-aliases/NodeMap.md)

#### Parameters

• ...**u**: [```node_${string}```, `Partial`\<`DistributiveOmit`\<[`Node`](../type-aliases/Node.md)\<`T`\>, `"lastEdited"`\>\>][]

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:8](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/EditableMicrocosmAPI.ts#L8)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`dispose`](MicrocosmAPI.md#dispose)

#### Source

[packages/statekit/src/State.ts:110](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L110)

***

### get()

> **get**(): [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Returns

[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`get`](MicrocosmAPI.md#get)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`key`](MicrocosmAPI.md#key)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`on`](MicrocosmAPI.md#on)

#### Source

[packages/statekit/src/State.ts:107](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L107)

***

### resetInitial()

> **resetInitial**(): `void`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`resetInitial`](MicrocosmAPI.md#resetinitial)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`set`](MicrocosmAPI.md#set)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`use`](MicrocosmAPI.md#use)

#### Source

[packages/statekit/src/State.ts:124](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/packages/statekit/src/State.ts#L124)

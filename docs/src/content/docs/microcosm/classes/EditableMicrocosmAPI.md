---
editUrl: false
next: false
prev: false
title: "EditableMicrocosmAPI"
---

Creates an instance of the **EditableMicrocosmAPI** class. This permits
edit (create, patch, update, delete) operations on the Microcosm.

## Example

```ts
const example = new EditableMicrocosmAPI({
   microcosmID: getMicrososmID('example'),
   identityID: 'identity_example'
})
```

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

[internal/microcosm/src/MicrocosmAPI.ts:49](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L49)

## Properties

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`boxes`](MicrocosmAPI.md#boxes)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:98](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L98)

***

### create()

> **create**: (`n`) => `Promise`\<`string` \| `string`[]\>

#### Parameters

• **n**: [`NewNode`](../type-aliases/NewNode.md) \| [`NewNode`](../type-aliases/NewNode.md)[]

#### Returns

`Promise`\<`string` \| `string`[]\>

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L17)

***

### delete()

> **delete**: (`NodeID`) => `void`

#### Parameters

• **NodeID**: ```node_${string}```

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L20)

***

### deleteAll()

> **deleteAll**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L21)

***

### destroy()

> **destroy**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L24)

***

### getCollection()

> **getCollection**: (`identityID`) => [`NodeReference`](../type-aliases/NodeReference.md)[]

Gets a snapshot of Nodes in a collection

#### Parameters

• **identityID**: ```identity_${string}```

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`getCollection`](MicrocosmAPI.md#getcollection)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L90)

***

### getCollections()

> **getCollections**: () => ```identity_${string}```[]

#### Returns

```identity_${string}```[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`getCollections`](MicrocosmAPI.md#getcollections)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:81](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L81)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`id`](MicrocosmAPI.md#id)

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`isActive`](MicrocosmAPI.md#isactive)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L92)

***

### join()

> **join**: (`username`?) => `void`

#### Parameters

• **username?**: `string`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L22)

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\[`K`\]\>

#### Type parameters

• **K** extends keyof [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\[`K`\]\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`key`](MicrocosmAPI.md#key)

#### Source

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### leave()

> **leave**: (`username`?) => `void`

#### Parameters

• **username?**: `string`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L23)

***

### microcosmID

> **`readonly`** **microcosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`microcosmID`](MicrocosmAPI.md#microcosmid)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L42)

***

### node()

> **node**: \<`T`\>(`NodeID`, `type`?) => `undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>

Retrieves a single [Node](../../../../../../microcosm/type-aliases/node) by [NodeID](../../../../../../microcosm/type-aliases/nodeid) and optional type

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

[internal/microcosm/src/MicrocosmAPI.ts:75](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L75)

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

[internal/microcosm/src/MicrocosmAPI.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L77)

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

[internal/microcosm/src/EditableMicrocosmAPI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L18)

***

### redo()

> **redo**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L26)

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md) \| `Partial`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\> \| (`state`) => [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md) \| `Partial`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`set`](MicrocosmAPI.md#set)

#### Source

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md), keyof [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`signal`](MicrocosmAPI.md#signal)

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

***

### subscribeToCollection()

> **subscribeToCollection**: (`identity`) => `Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Parameters

• **identity**: ```identity_${string}```

#### Returns

`Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`subscribeToCollection`](MicrocosmAPI.md#subscribetocollection)

#### Source

[internal/microcosm/src/MicrocosmAPI.ts:83](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/MicrocosmAPI.ts#L83)

***

### undo()

> **undo**: () => `void`

#### Returns

`void`

#### Source

[internal/microcosm/src/EditableMicrocosmAPI.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L25)

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

[internal/microcosm/src/EditableMicrocosmAPI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/microcosm/src/EditableMicrocosmAPI.ts#L19)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`dispose`](MicrocosmAPI.md#dispose)

#### Source

[packages/statekit/src/State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L73)

***

### get()

> **get**(): [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Returns

[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`get`](MicrocosmAPI.md#get)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`on`](MicrocosmAPI.md#on)

#### Source

[packages/statekit/src/State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L70)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`reset`](MicrocosmAPI.md#reset)

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

[`MicrocosmAPI`](MicrocosmAPI.md).[`use`](MicrocosmAPI.md#use)

#### Source

[packages/statekit/src/State.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L87)

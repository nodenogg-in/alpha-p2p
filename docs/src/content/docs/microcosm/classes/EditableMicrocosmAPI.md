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

[packages/microcosm/src/MicrocosmAPI.ts:69](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L69)

## Properties

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`boxes`](MicrocosmAPI.md#boxes)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:106](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L106)

***

### collection()

> **collection**: (`identity`) => `Signal`\<```node_${string}```[]\>

#### Parameters

• **identity**: ```identity_${string}```

#### Returns

`Signal`\<```node_${string}```[]\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`collection`](MicrocosmAPI.md#collection)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L92)

***

### collections()

> **collections**: () => `Signal`\<```identity_${string}```[]\>

#### Returns

`Signal`\<```identity_${string}```[]\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`collections`](MicrocosmAPI.md#collections)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L90)

***

### create()

> **create**: (`n`) => ```node_${string}``` \| ```node_${string}```[]

#### Parameters

• **n**: [`NewNode`](../type-aliases/NewNode.md) \| [`NewNode`](../type-aliases/NewNode.md)[]

#### Returns

```node_${string}``` \| ```node_${string}```[]

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L17)

***

### delete()

> **delete**: (`NodeID`) => `void`

#### Parameters

• **NodeID**: ```node_${string}```

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L20)

***

### deleteAll()

> **deleteAll**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L21)

***

### destroy()

> **destroy**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L24)

***

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`dispose`](MicrocosmAPI.md#dispose)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:108](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L108)

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`isActive`](MicrocosmAPI.md#isactive)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L100)

***

### join()

> **join**: (`nickname`?) => `void`

#### Parameters

• **nickname?**: `string`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L22)

***

### leave()

> **leave**: (`nickname`?) => `void`

#### Parameters

• **nickname?**: `string`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L23)

***

### manager

> **manager**: `Manager`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`manager`](MicrocosmAPI.md#manager)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L54)

***

### microcosmID

> **`readonly`** **microcosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`microcosmID`](MicrocosmAPI.md#microcosmid)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:51](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L51)

***

### node()

> **node**: \<`T`\>(`identityID`, `nodeID`, `type`?) => `Signal`\<`undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>\>

#### Type parameters

• **T** extends keyof [`NodeMap`](../type-aliases/NodeMap.md) = keyof [`NodeMap`](../type-aliases/NodeMap.md)

#### Parameters

• **identityID**: ```identity_${string}```

• **nodeID**: ```node_${string}```

• **type?**: `T`

#### Returns

`Signal`\<`undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`node`](MicrocosmAPI.md#node)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L94)

***

### nodes()

> **nodes**: \<`T`\>(`type`?) => `T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

Retrieves a single [Node](../../../../../../microcosm/type-aliases/node) by [NodeID](../../../../../../microcosm/type-aliases/nodeid) and optional type

#### Type parameters

• **T** extends `undefined` \| keyof NodeMap = `undefined`

#### Parameters

• **type?**: `T`

#### Returns

`T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`nodes`](MicrocosmAPI.md#nodes)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L86)

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

[packages/microcosm/src/EditableMicrocosmAPI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L18)

***

### redo()

> **redo**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L26)

***

### state

> **state**: `SignalObject`\<`MicrocosmAPIState`, keyof `MicrocosmAPIState`\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`state`](MicrocosmAPI.md#state)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L56)

***

### undo()

> **undo**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L25)

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

[packages/microcosm/src/EditableMicrocosmAPI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/EditableMicrocosmAPI.ts#L19)

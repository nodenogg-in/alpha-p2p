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

• **telemetry?**: [`BaseTelemetry`](../interfaces/BaseTelemetry.md)

#### Returns

[`EditableMicrocosmAPI`](EditableMicrocosmAPI.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`constructor`](MicrocosmAPI.md#constructors)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:51](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L51)

## Properties

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`boxes`](MicrocosmAPI.md#boxes)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L100)

***

### create()

> **create**: (`n`) => `Promise`\<`string` \| `string`[]\>

#### Parameters

• **n**: [`NewNode`](../type-aliases/NewNode.md) \| [`NewNode`](../type-aliases/NewNode.md)[]

#### Returns

`Promise`\<`string` \| `string`[]\>

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L17)

***

### delete()

> **delete**: (`NodeID`) => `void`

#### Parameters

• **NodeID**: ```node_${string}```

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L20)

***

### deleteAll()

> **deleteAll**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L21)

***

### destroy()

> **destroy**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L24)

***

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`dispose`](MicrocosmAPI.md#dispose)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:96

***

### get()

> **get**: () => [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Returns

[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`get`](MicrocosmAPI.md#get)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:92

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

[packages/microcosm/src/MicrocosmAPI.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L92)

***

### getCollections()

> **getCollections**: () => ```identity_${string}```[]

#### Returns

```identity_${string}```[]

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`getCollections`](MicrocosmAPI.md#getcollections)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:83](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L83)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`id`](MicrocosmAPI.md#id)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:83

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`isActive`](MicrocosmAPI.md#isactive)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L94)

***

### join()

> **join**: (`nickname`?) => `void`

#### Parameters

• **nickname?**: `string`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L22)

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

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:93

***

### leave()

> **leave**: (`nickname`?) => `void`

#### Parameters

• **nickname?**: `string`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L23)

***

### microcosmID

> **`readonly`** **microcosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`microcosmID`](MicrocosmAPI.md#microcosmid)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L44)

***

### node()

> **node**: \<`T`\>(`NodeID`, `type`?) => `undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>

Retrieves a single [Node](../../../../../../../microcosm/type-aliases/node) by [NodeID](../../../../../../../microcosm/type-aliases/nodeid) and optional type

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

[packages/microcosm/src/MicrocosmAPI.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L77)

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

[packages/microcosm/src/MicrocosmAPI.ts:79](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L79)

***

### on()

> **on**: (`sub`) => `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`on`](MicrocosmAPI.md#on)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:95

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

[packages/microcosm/src/EditableMicrocosmAPI.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L18)

***

### redo()

> **redo**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:26](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L26)

***

### reset()

> **reset**: () => `void`

#### Returns

`void`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`reset`](MicrocosmAPI.md#reset)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:98

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

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:91

***

### signal

> **signal**: `SignalObject`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md), keyof [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`signal`](MicrocosmAPI.md#signal)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:84

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

[packages/microcosm/src/MicrocosmAPI.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/MicrocosmAPI.ts#L85)

***

### undo()

> **undo**: () => `void`

#### Returns

`void`

#### Source

[packages/microcosm/src/EditableMicrocosmAPI.ts:25](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L25)

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

[packages/microcosm/src/EditableMicrocosmAPI.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/b2606a07ac492cf6a35305dd9d2261575053d888/packages/microcosm/src/EditableMicrocosmAPI.ts#L19)

***

### use()

> **use**: (...`sub`) => `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

[`MicrocosmAPI`](MicrocosmAPI.md).[`use`](MicrocosmAPI.md#use)

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:97

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.4.5\_/node\_modules/@figureland/statekit/dist/index.d.ts:94

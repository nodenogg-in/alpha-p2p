---
editUrl: false
next: false
prev: false
title: "MicrocosmAPI"
---

Creates an instance of the **MicrocosmAPI** class. This permits
read operations on the Microcosm.

## Example

```ts
const example = new MicrocosmAPI({
   microcosmID: 'example-microcosm.uuid',
   identityID: 'identity_example'
})
```

## Extends

- `State`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

## Type parameters

• **T** extends [`BaseTelemetry`](../interfaces/BaseTelemetry.md) = [`BaseTelemetry`](../interfaces/BaseTelemetry.md)

## Constructors

### new MicrocosmAPI(__namedParameters, telemetry)

> **new MicrocosmAPI**\<`T`\>(`__namedParameters`, `telemetry`?): [`MicrocosmAPI`](MicrocosmAPI.md)\<`T`\>

Creates a new Microcosm

#### Parameters

• **\_\_namedParameters**: [`MicrocosmAPIConfig`](../type-aliases/MicrocosmAPIConfig.md)

• **telemetry?**: `T`

#### Returns

[`MicrocosmAPI`](MicrocosmAPI.md)\<`T`\>

#### Overrides

`State<MicrocosmAPIEvents>.constructor`

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:51](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L51)

## Properties

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L100)

***

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

`State.dispose`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:96

***

### get()

> **get**: () => [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Returns

[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)

#### Inherited from

`State.get`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:92

***

### getCollection()

> **getCollection**: (`identityID`) => [`NodeReference`](../type-aliases/NodeReference.md)[]

Gets a snapshot of Nodes in a collection

#### Parameters

• **identityID**: ```identity_${string}```

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)[]

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L92)

***

### getCollections()

> **getCollections**: () => ```identity_${string}```[]

#### Returns

```identity_${string}```[]

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:83](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L83)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:83

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L94)

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

`State.key`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:93

***

### microcosmID

> **`readonly`** **microcosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L44)

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

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L77)

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

[packages/microcosm/src/MicrocosmAPI.ts:79](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L79)

***

### on()

> **on**: (`sub`) => `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

`State.on`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:95

***

### reset()

> **reset**: () => `void`

#### Returns

`void`

#### Inherited from

`State.reset`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:98

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md) \| `Partial`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\> \| (`state`) => [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md) \| `Partial`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:91

***

### signal

> **signal**: `SignalObject`\<[`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md), keyof [`MicrocosmAPIEvents`](../type-aliases/MicrocosmAPIEvents.md)\>

#### Inherited from

`State.signal`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:84

***

### subscribeToCollection()

> **subscribeToCollection**: (`identity`) => `Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Parameters

• **identity**: ```identity_${string}```

#### Returns

`Signal`\<[`NodeReference`](../type-aliases/NodeReference.md)[]\>

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:85](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/MicrocosmAPI.ts#L85)

***

### use()

> **use**: (...`sub`) => `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

`State.use`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:97

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23/node\_modules/@figureland/statekit/dist/index.d.ts:94

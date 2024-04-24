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

## Extended by

- [`EditableMicrocosmAPI`](EditableMicrocosmAPI.md)

## Type parameters

• **T** extends `Telemetry` = `Telemetry`

## Implements

- `Disposable$1`

## Constructors

### new MicrocosmAPI(__namedParameters, telemetry)

> **new MicrocosmAPI**\<`T`\>(`__namedParameters`, `telemetry`?): [`MicrocosmAPI`](MicrocosmAPI.md)\<`T`\>

Creates a new Microcosm

#### Parameters

• **\_\_namedParameters**: [`MicrocosmAPIConfig`](../type-aliases/MicrocosmAPIConfig.md)

• **telemetry?**: `T`

#### Returns

[`MicrocosmAPI`](MicrocosmAPI.md)\<`T`\>

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:69](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L69)

## Properties

### boxes()

> **boxes**: () => [`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

Get a list of positioned HTML boxes within the current Microcosm

#### Returns

[`NodeReference`](../type-aliases/NodeReference.md)\<`"html"`\>[]

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:106](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L106)

***

### collection()

> **collection**: (`identity`) => `Signal`\<```node_${string}```[]\>

#### Parameters

• **identity**: ```identity_${string}```

#### Returns

`Signal`\<```node_${string}```[]\>

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:92](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L92)

***

### collections()

> **collections**: () => `Signal`\<```identity_${string}```[]\>

#### Returns

`Signal`\<```identity_${string}```[]\>

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L90)

***

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Implementation of

`Disposable.dispose`

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:108](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L108)

***

### isActive()

> **isActive**: () => `boolean`

#### Returns

`boolean`

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:100](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L100)

***

### manager

> **manager**: `Manager`

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:54](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L54)

***

### microcosmID

> **`readonly`** **microcosmID**: [`MicrocosmID`](../type-aliases/MicrocosmID.md)

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

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L86)

***

### state

> **state**: `SignalObject`\<`MicrocosmAPIState`, keyof `MicrocosmAPIState`\>

#### Source

[packages/microcosm/src/MicrocosmAPI.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/MicrocosmAPI.ts#L56)

---
editUrl: false
next: false
prev: false
title: "MicrocosmAPI"
---

## Extends

- `Disposable$1`

## Properties

### config

> **config**: `Readonly`\<[`MicrocosmAPIConfig`](../type-aliases/MicrocosmAPIConfig.md)\>

#### Source

[packages/microcosm/src/api/EditableMicrocosmAPI.ts:31](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/api/EditableMicrocosmAPI.ts#L31)

***

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

`Disposable.dispose`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.71\_@figureland+mathkit@0.0.28\_@figureland+typekit@0.0.22\_superjson@2\_pz45gep75b4jblymk7bvgjwakm/node\_modules/@figureland/statekit/dist/index.d.ts:14

***

### node()

> **node**: \<`T`\>(`identityID`, `nodeID`, `type`?) => `Signal`\<`undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>\>

#### Type parameters

• **T** extends [`NodeType`](../type-aliases/NodeType.md)

#### Parameters

• **identityID**: ```identity_${string}```

• **nodeID**: ```node_${string}```

• **type?**: `T`

#### Returns

`Signal`\<`undefined` \| [`Node`](../type-aliases/Node.md)\<`T`\>\>

#### Source

[packages/microcosm/src/api/EditableMicrocosmAPI.ts:34](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/api/EditableMicrocosmAPI.ts#L34)

***

### nodes()

> **nodes**: (`type`?) => [`Node`](../type-aliases/Node.md)[]

#### Parameters

• **type?**: [`NodeType`](../type-aliases/NodeType.md)

#### Returns

[`Node`](../type-aliases/Node.md)[]

#### Source

[packages/microcosm/src/api/EditableMicrocosmAPI.ts:33](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/api/EditableMicrocosmAPI.ts#L33)

***

### state

> **state**: `SignalObject`\<[`MicrocosmAPIState`](../type-aliases/MicrocosmAPIState.md), keyof [`MicrocosmAPIState`](../type-aliases/MicrocosmAPIState.md)\>

#### Source

[packages/microcosm/src/api/EditableMicrocosmAPI.ts:32](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/api/EditableMicrocosmAPI.ts#L32)

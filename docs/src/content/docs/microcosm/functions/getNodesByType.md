---
editUrl: false
next: false
prev: false
title: "getNodesByType"
---

> **getNodesByType**\<`T`\>(`nodes`, `type`?): `T` extends `undefined` ? [`Node`](../type-aliases/Node.md)[] : `never` \| [`Node`](../type-aliases/Node.md)\<`NonNullable`\<`T`\>\>[]

## Type parameters

• **T** extends `undefined` \| [`NodeType`](../type-aliases/NodeType.md) = `undefined`

## Parameters

• **nodes**: [`Node`](../type-aliases/Node.md)[]

• **type?**: `T`

## Returns

`T` extends `undefined` ? [`Node`](../type-aliases/Node.md)[] : `never` \| [`Node`](../type-aliases/Node.md)\<`NonNullable`\<`T`\>\>[]

## Source

[packages/microcosm/src/operations/query.ts:4](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/operations/query.ts#L4)

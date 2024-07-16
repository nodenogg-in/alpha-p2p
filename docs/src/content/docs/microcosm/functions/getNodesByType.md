---
editUrl: false
next: false
prev: false
title: "getNodesByType"
---

> **getNodesByType**\<`T`\>(`nodes`, `type`?): `T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

## Type parameters

• **T** extends `undefined` \| keyof NodeMap = `undefined`

## Parameters

• **nodes**: [`NodeReference`](../type-aliases/NodeReference.md)[]

• **type?**: `T`

## Returns

`T` extends `undefined` ? [`NodeReference`](../type-aliases/NodeReference.md)[] : `never` \| [`NodeReference`](../type-aliases/NodeReference.md)\<`NonNullable`\<`T`\>\>[]

## Source

[packages/microcosm/src/utils/query.ts:3](https://github.com/nodenogg-in/alpha-p2p/blob/eef58d6a6d6a6f76abda4ba5686a340e45c0c40b/packages/microcosm/src/utils/query.ts#L3)

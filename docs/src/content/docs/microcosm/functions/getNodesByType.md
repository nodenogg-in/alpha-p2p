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

[packages/microcosm/src/utils/query.ts:3](https://github.com/nodenogg-in/alpha-p2p/blob/537491b7f422df1359d1cfda9feedcc4a36a0605/packages/microcosm/src/utils/query.ts#L3)

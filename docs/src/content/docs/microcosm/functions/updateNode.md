---
editUrl: false
next: false
prev: false
title: "updateNode"
---

> **updateNode**\<`T`\>(`existing`, `update`): `Promise`\<[`Node`](../type-aliases/Node.md)\<`T`\>\>

## Type parameters

• **T** extends `"html"` \| `"emoji"` \| `"connection"`

## Parameters

• **existing**: [`Node`](../type-aliases/Node.md)\<`T`\>

• **update**: `Partial`\<`DistributiveOmit`\<[`Node`](../type-aliases/Node.md)\<`T`\>, `"lastEdited"`\>\>

## Returns

`Promise`\<[`Node`](../type-aliases/Node.md)\<`T`\>\>

## Source

[packages/microcosm/src/utils/update.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/bce45d3dc78f9a00957a766d70c8bb1a066ebf43/packages/microcosm/src/utils/update.ts#L16)

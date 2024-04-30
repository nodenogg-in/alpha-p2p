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

[packages/microcosm/src/utils/update.ts:16](https://github.com/nodenogg-in/alpha-p2p/blob/43ae393b39608a021b44acaf5959924eff4aeb19/packages/microcosm/src/utils/update.ts#L16)

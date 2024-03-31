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

[internal/microcosm/src/utils/update.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/internal/microcosm/src/utils/update.ts#L18)

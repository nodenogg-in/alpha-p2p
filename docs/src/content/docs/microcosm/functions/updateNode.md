---
editUrl: false
next: false
prev: false
title: "updateNode"
---

> **updateNode**\<`T`\>(`existing`, `update`): [`Node`](../type-aliases/Node.md)\<`T`\>

## Type parameters

• **T** extends `"html"` \| `"emoji"` \| `"connection"`

## Parameters

• **existing**: [`Node`](../type-aliases/Node.md)\<`T`\>

• **update**: `Partial`\<`DistributiveOmit`\<[`Node`](../type-aliases/Node.md)\<`T`\>, `"lastEdited"`\>\>

## Returns

[`Node`](../type-aliases/Node.md)\<`T`\>

## Source

[packages/microcosm/src/utils/update.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/utils/update.ts#L17)

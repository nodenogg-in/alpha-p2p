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

[packages/microcosm/src/utils/update.ts:17](https://github.com/nodenogg-in/alpha-p2p/blob/d624cf9b15dbfd7fc2661f690e3277335e5f9583/packages/microcosm/src/utils/update.ts#L17)

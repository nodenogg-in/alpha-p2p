---
editUrl: false
next: false
prev: false
title: "update"
---

> **update**\<`T`, `N`\>(`existing`, `update`): `N`

## Type parameters

• **T** extends [`NodeType`](../type-aliases/NodeType.md)

• **N** extends EmojiNode \| HTMLNode \| ConnectionNode \| GhostNode \| RegionNode & `Object`

## Parameters

• **existing**: `N`

• **update**: `Partial`\<`DistributiveOmit`\<`N`, `ReadonlyNodeFields`\>\>

## Returns

`N`

## Source

[packages/microcosm/src/operations/update.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/operations/update.ts#L22)

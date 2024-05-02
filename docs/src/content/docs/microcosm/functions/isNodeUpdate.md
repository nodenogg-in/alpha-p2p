---
editUrl: false
next: false
prev: false
title: "isNodeUpdate"
---

> **isNodeUpdate**\<`T`\>(`u`): `u is Partial<DistributiveOmit<Node<T>, "lastEdited">>`

## Type parameters

• **T** extends keyof [`NodeMap`](../type-aliases/NodeMap.md)

## Parameters

• **u**: `Partial`\<`DistributiveOmit`\<[`Node`](../type-aliases/Node.md)\<`T`\>, `"lastEdited"`\>\> \| `Partial`\<`DistributiveOmit`\<[`Node`](../type-aliases/Node.md)\<`T`\>, `"lastEdited"`\>\>[]

## Returns

`u is Partial<DistributiveOmit<Node<T>, "lastEdited">>`

## Source

[packages/microcosm/src/utils/update.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/48d1c8b099632a7e2c2080f89bcf15f0aeed6eaf/packages/microcosm/src/utils/update.ts#L12)

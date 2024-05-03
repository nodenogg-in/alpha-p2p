---
editUrl: false
next: false
prev: false
title: "isNodeVersion"
---

> **isNodeVersion**\<`S`, `T`\>(`node`, `schema`, `type`?): `node is Version<S, T extends NodeType ? Node<T<T>> : Node>`

## Type parameters

• **S** extends `number`

• **T** extends `"emoji"` \| `"html"` \| `"connection"` \| `"ghost"` \| `"region"`

## Parameters

• **node**: `unknown`

• **schema**: `S`

• **type?**: `T`

## Returns

`node is Version<S, T extends NodeType ? Node<T<T>> : Node>`

## Source

[packages/microcosm/src/guards/node-guards.ts:35](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/guards/node-guards.ts#L35)

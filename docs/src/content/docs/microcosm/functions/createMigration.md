---
editUrl: false
next: false
prev: false
title: "createMigration"
---

> **createMigration**\<`T`, `V1`, `V2`, `I`, `O`, `AddFields`\>(`type`, `migration`, `changes`): [`NodeMigration`](../type-aliases/NodeMigration.md)\<`I`, `O`\>

## Type parameters

• **T** extends [`NodeType`](../type-aliases/NodeType.md)

• **V1** extends `1` \| `2`

• **V2** extends `1` \| `2`

• **I** extends EmojiNode \| HTMLNode \| ConnectionNode \| GhostNode \| RegionNode & `Object`

• **O** extends EmojiNode \| HTMLNode \| ConnectionNode \| GhostNode \| RegionNode & `Object`

• **AddFields** extends `Omit`\<`Partial`\<`O`\>, `ReadonlyNodeFields`\>

## Parameters

• **type**: `T`

• **migration**: [`V1`, `V2`]

• **changes**

• **changes\.add?**

• **changes\.remove?**: keyof `I`[]

## Returns

[`NodeMigration`](../type-aliases/NodeMigration.md)\<`I`, `O`\>

## Source

[packages/microcosm/src/operations/migrate.ts:11](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/microcosm/src/operations/migrate.ts#L11)

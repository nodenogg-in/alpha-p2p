---
editUrl: false
next: false
prev: false
title: "microcosmReferenceSchema"
---

> **`const`** **microcosmReferenceSchema**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

Validation schema for a single Microcosm

## Type declaration

### lastAccessed

> **lastAccessed**: `NumberSchema`\<`number`\>

### microcosmID

> **microcosmID**: `SpecialSchema`\<[`MicrocosmID`](../type-aliases/MicrocosmID.md), [`MicrocosmID`](../type-aliases/MicrocosmID.md)\>

### password

> **password**: `OptionalSchema`\<`StringSchema`\<`string`\>, `undefined`, `undefined` \| `string`\>

### view

> **view**: `OptionalSchema`\<`StringSchema`\<`string`\>, `undefined`, `undefined` \| `string`\>

## Source

[packages/microcosm/src/schema/core.schema.ts:89](https://github.com/nodenogg-in/alpha-p2p/blob/abd15ac8ea05df755d6048ca2d2de6e86911127a/packages/microcosm/src/schema/core.schema.ts#L89)

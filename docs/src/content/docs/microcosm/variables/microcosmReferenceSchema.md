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

[packages/microcosm/src/schema/core.schema.ts:102](https://github.com/nodenogg-in/alpha-p2p/blob/d420d334028521cd4d3e88f86962ebfaad1f4292/packages/microcosm/src/schema/core.schema.ts#L102)

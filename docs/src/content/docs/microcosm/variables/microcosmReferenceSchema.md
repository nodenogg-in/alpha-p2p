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

[packages/microcosm/src/schema/core.schema.ts:89](https://github.com/nodenogg-in/alpha-p2p/blob/b5a92ec368c11e5b1ed34a190813f3e3bd62fc80/packages/microcosm/src/schema/core.schema.ts#L89)

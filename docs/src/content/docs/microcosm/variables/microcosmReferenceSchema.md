---
editUrl: false
next: false
prev: false
title: "microcosmReferenceSchema"
---

> **`const`** **microcosmReferenceSchema**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

Validation schema for a single Microcosm

## Type declaration

### MicrocosmID

> **MicrocosmID**: `SpecialSchema`\<[`MicrocosmID`](../type-aliases/MicrocosmID.md), [`MicrocosmID`](../type-aliases/MicrocosmID.md)\> = `microcosmURI`

### lastAccessed

> **lastAccessed**: `NumberSchema`\<`number`\>

### password

> **password**: `OptionalSchema`\<`StringSchema`\<`string`\>, `undefined`, `undefined` \| `string`\>

### view

> **view**: `OptionalSchema`\<`StringSchema`\<`string`\>, `undefined`, `undefined` \| `string`\>

## Source

[internal/microcosm/src/schema/core.schema.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/c7367f2/internal/microcosm/src/schema/core.schema.ts#L73)

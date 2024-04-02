---
editUrl: false
next: false
prev: false
title: "htmlNodeSchema"
---

> **`const`** **htmlNodeSchema**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

Validation schema for a single node

## Example

A simple example of how to use this schema:
```ts
const node = {
  type: 'html',
  lastEdited: 2,
  content: 'Hello, world!',
  x: 0,
  y: 0,
  width: 100,
  height: 100
}

if (is(nodeSchema, node)) {
   ...
}
```

## Type declaration

### background\_color

> **background\_color**: `OptionalSchema`\<`StringSchema`\<`string`\>, `undefined`, `undefined` \| `string`\>

### content

> **content**: `StringSchema`\<`string`\>

### height

> **height**: `NumberSchema`\<`number`\>

### lastEdited

> **lastEdited**: `NumberSchema`\<`number`\>

### type

> **type**: `LiteralSchema`\<`"html"`, `"html"`\>

### width

> **width**: `NumberSchema`\<`number`\>

### x

> **x**: `NumberSchema`\<`number`\>

### y

> **y**: `NumberSchema`\<`number`\>

## Source

[internal/microcosm/src/schema/core.schema.ts:45](https://github.com/nodenogg-in/alpha-p2p/blob/265a0e2/internal/microcosm/src/schema/core.schema.ts#L45)

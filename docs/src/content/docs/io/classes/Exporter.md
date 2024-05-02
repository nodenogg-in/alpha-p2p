---
editUrl: false
next: false
prev: false
title: "Exporter"
---

## Constructors

### new Exporter()

> **new Exporter**(): [`Exporter`](Exporter.md)

#### Returns

[`Exporter`](Exporter.md)

## Methods

### exportNode()

> **exportNode**(`type`, `content`): `Promise`\<`string`\>

#### Parameters

• **type**: `"text/html"` \| `"text/markdown"`

• **content**

• **content\.background\_color?**: `string`= `undefined`

• **content\.content**: `string`= `undefined`

• **content\.height**: `number`= `undefined`

• **content\.lastEdited**: `number`= `undefined`

• **content\.type**: `"html"`= `undefined`

• **content\.width**: `number`= `undefined`

• **content\.x**: `number`= `undefined`

• **content\.y**: `number`= `undefined`

#### Returns

`Promise`\<`string`\>

#### Source

[packages/io/src/export.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/48d1c8b099632a7e2c2080f89bcf15f0aeed6eaf/packages/io/src/export.ts#L18)

***

### exportNodes()

> **exportNodes**(`type`, `nodes`): `Promise`\<`string`[]\>

#### Parameters

• **type**: `"text/html"` \| `"text/markdown"`

• **nodes**: `Object`[]

#### Returns

`Promise`\<`string`[]\>

#### Source

[packages/io/src/export.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/48d1c8b099632a7e2c2080f89bcf15f0aeed6eaf/packages/io/src/export.ts#L21)

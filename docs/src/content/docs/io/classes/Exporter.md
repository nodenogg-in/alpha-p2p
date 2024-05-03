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

• **type**: `"text/html"` \| `"text/markdown"` \| `"application/json"`

• **content**: `HTMLNode`

#### Returns

`Promise`\<`string`\>

#### Source

[packages/io/src/export.ts:21](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/io/src/export.ts#L21)

***

### exportNodes()

> **exportNodes**(`type`, `nodes`): `Promise`\<`Object`\>

#### Parameters

• **type**: `"text/html"` \| `"text/markdown"` \| `"application/json"`

• **nodes**: `HTMLNode`[]

#### Returns

`Promise`\<`Object`\>

> ##### fulfilled
>
> > **fulfilled**: `string`[]
>
> ##### rejected
>
> > **rejected**: `PromiseSettledResult`\<`string`\>[]
>

#### Source

[packages/io/src/export.ts:24](https://github.com/nodenogg-in/alpha-p2p/blob/d3c0d0ee190bdee84f8272463e9c5efc8c84f42d/packages/io/src/export.ts#L24)

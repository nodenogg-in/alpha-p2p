---
editUrl: false
next: false
prev: false
title: "MinimapRenderer"
---

## Constructors

### new MinimapRenderer(options)

> **new MinimapRenderer**(`options`): [`MinimapRenderer`](MinimapRenderer.md)

#### Parameters

• **options**: `RenderOptions`

#### Returns

[`MinimapRenderer`](MinimapRenderer.md)

#### Source

[packages/infinitykit/src/minimap.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/minimap.ts#L23)

## Methods

### render()

> **render**(`nodes`, `state`): `void`

#### Parameters

• **nodes**: [`BoxReference`](../type-aliases/BoxReference.md)[]

• **state**

• **state\.background**: `"dots"` \| `"lines"` \| `"none"`= `backgroundPattern`

• **state\.bounds**= `pointSchema`

• **state\.bounds\.x**: `number`= `undefined`

• **state\.bounds\.y**: `number`= `undefined`

• **state\.cardOutline**: `number`= `undefined`

• **state\.grid**: `number`= `undefined`

• **state\.loaded**: `boolean`= `undefined`

• **state\.previous**= `undefined`

• **state\.previous\.distance**: `number`= `undefined`

• **state\.previous\.transform**= `transformSchema`

• **state\.previous\.transform\.scale**: `number`= `undefined`

• **state\.previous\.transform\.translate**= `pointSchema`

• **state\.previous\.transform\.translate\.x**: `number`= `undefined`

• **state\.previous\.transform\.translate\.y**: `number`= `undefined`

• **state\.snapToGrid**: `boolean`= `undefined`

• **state\.transform**= `transformSchema`

• **state\.transform\.scale**: `number`= `undefined`

• **state\.transform\.translate**= `pointSchema`

• **state\.transform\.translate\.x**: `number`= `undefined`

• **state\.transform\.translate\.y**: `number`= `undefined`

• **state\.viewport**: `Object` & `Object`= `boxSchema`

• **state\.zoom**= `undefined`

• **state\.zoom\.increment**: `number`= `undefined`

• **state\.zoom\.max**: `number`= `undefined`

• **state\.zoom\.min**: `number`= `undefined`

#### Returns

`void`

#### Source

[packages/infinitykit/src/minimap.ts:36](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/minimap.ts#L36)

***

### renderToCanvas()

> **renderToCanvas**(`element`): `void`

#### Parameters

• **element**: `HTMLCanvasElement`

#### Returns

`void`

#### Source

[packages/infinitykit/src/minimap.ts:72](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/minimap.ts#L72)

***

### update()

> **update**(`u`): `void`

#### Parameters

• **u**: `Partial`\<`RenderOptions`\>

#### Returns

`void`

#### Source

[packages/infinitykit/src/minimap.ts:29](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/infinitykit/src/minimap.ts#L29)

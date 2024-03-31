---
editUrl: false
next: false
prev: false
title: "defaultCanvasInteractionState"
---

> **defaultCanvasInteractionState**(): `Object`

## Returns

`Object`

### background

> **background**: `"dots"` \| `"lines"` \| `"none"` = `backgroundPattern`

### bounds

> **bounds**: `Object` = `pointSchema`

### bounds.x

> **x**: `number`

### bounds.y

> **y**: `number`

### cardOutline

> **cardOutline**: `number`

### grid

> **grid**: `number`

### loaded

> **loaded**: `boolean`

### previous

> **previous**: `Object`

### previous.distance

> **distance**: `number`

### previous.transform

> **transform**: `Object` = `transformSchema`

### previous.transform.scale

> **scale**: `number`

### previous.transform.translate

> **translate**: `Object` = `pointSchema`

### previous.transform.translate.x

> **x**: `number`

### previous.transform.translate.y

> **y**: `number`

### snapToGrid

> **snapToGrid**: `boolean`

### transform

> **transform**: `Object` = `transformSchema`

### transform.scale

> **scale**: `number`

### transform.translate

> **translate**: `Object` = `pointSchema`

### transform.translate.x

> **x**: `number`

### transform.translate.y

> **y**: `number`

### viewport

> **viewport**: `Object` & `Object` = `boxSchema`

#### Type declaration

##### x

> **x**: `number`

##### y

> **y**: `number`

#### Type declaration

##### height

> **height**: `number`

##### width

> **width**: `number`

### zoom

> **zoom**: `Object`

### zoom.increment

> **increment**: `number`

### zoom.max

> **max**: `number`

### zoom.min

> **min**: `number`

## Source

[packages/spacekit/src/CanvasInteraction.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/spacekit/src/CanvasInteraction.ts#L56)

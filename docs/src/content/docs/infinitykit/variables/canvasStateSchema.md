---
editUrl: false
next: false
prev: false
title: "canvasStateSchema"
---

> **`const`** **canvasStateSchema**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

## Type declaration

### background

> **background**: `PicklistSchema`\<[`"dots"`, `"lines"`, `"none"`], `"dots"` \| `"lines"` \| `"none"`\> = `backgroundPattern`

### bounds

> **bounds**: `ObjectSchema`\<`Object`, `undefined`, `Object`\> = `pointSchema`

#### Type declaration

##### x

> **x**: `NumberSchema`\<`number`\>

##### y

> **y**: `NumberSchema`\<`number`\>

### cardOutline

> **cardOutline**: `NumberSchema`\<`number`\>

### grid

> **grid**: `NumberSchema`\<`number`\>

### loaded

> **loaded**: `BooleanSchema`\<`boolean`\>

### previous

> **previous**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

#### Type declaration

##### distance

> **distance**: `NumberSchema`\<`number`\>

##### transform

> **transform**: `ObjectSchema`\<`Object`, `undefined`, `Object`\> = `transformSchema`

###### Type declaration

###### scale

> **scale**: `NumberSchema`\<`number`\>

###### translate

> **translate**: `ObjectSchema`\<`Object`, `undefined`, `Object`\> = `pointSchema`

###### Type declaration

###### x

> **x**: `NumberSchema`\<`number`\>

###### y

> **y**: `NumberSchema`\<`number`\>

### snapToGrid

> **snapToGrid**: `BooleanSchema`\<`boolean`\>

### transform

> **transform**: `ObjectSchema`\<`Object`, `undefined`, `Object`\> = `transformSchema`

#### Type declaration

##### scale

> **scale**: `NumberSchema`\<`number`\>

##### translate

> **translate**: `ObjectSchema`\<`Object`, `undefined`, `Object`\> = `pointSchema`

###### Type declaration

###### x

> **x**: `NumberSchema`\<`number`\>

###### y

> **y**: `NumberSchema`\<`number`\>

### viewport

> **viewport**: `IntersectSchema`\<[`ObjectSchema`\<`Object`, `undefined`, `Object`\>, `ObjectSchema`\<`Object`, `undefined`, `Object`\>], `Object` & `Object`\> = `boxSchema`

### zoom

> **zoom**: `ObjectSchema`\<`Object`, `undefined`, `Object`\>

#### Type declaration

##### increment

> **increment**: `NumberSchema`\<`number`\>

##### max

> **max**: `NumberSchema`\<`number`\>

##### min

> **min**: `NumberSchema`\<`number`\>

## Source

[packages/infinitykit/src/Canvas.ts:35](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/infinitykit/src/Canvas.ts#L35)

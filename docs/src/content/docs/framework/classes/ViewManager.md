---
editUrl: false
next: false
prev: false
title: "ViewManager"
---

## Type parameters

• **M** extends `MicrocosmAPI`

• **V** extends [`MicrocosmViews`](../type-aliases/MicrocosmViews.md)

## Constructors

### new ViewManager(v, ui, session, defaultView, persist)

> **new ViewManager**\<`M`, `V`\>(`v`, `ui`, `session`, `defaultView`, `persist`?): [`ViewManager`](ViewManager.md)\<`M`, `V`\>

#### Parameters

• **v**: `V`

• **ui**: [`UI`](UI.md)

• **session**: [`Session`](Session.md)

• **defaultView**: keyof `V`= `undefined`

• **persist?**: `boolean`

#### Returns

[`ViewManager`](ViewManager.md)\<`M`, `V`\>

#### Source

[internal/framework/src/state/ViewManager.ts:43](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L43)

## Properties

### create

> **`readonly`** **create**: `{ [K in string | number | symbol]: Function }`

#### Source

[internal/framework/src/state/ViewManager.ts:39](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L39)

***

### defaultView

> **`readonly`** **defaultView**: keyof `V`

#### Source

[internal/framework/src/state/ViewManager.ts:47](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L47)

***

### persist?

> **`optional`** **`readonly`** **persist**: `boolean`

#### Source

[internal/framework/src/state/ViewManager.ts:48](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L48)

***

### types

> **`readonly`** **types**: keyof `V`[]

#### Source

[internal/framework/src/state/ViewManager.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L42)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[internal/framework/src/state/ViewManager.ts:88](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L88)

***

### register()

> **register**\<`K`, `R`\>(`type`, `api`, `id`): `Promise`\<`R`\>

#### Type parameters

• **K** extends `string` \| `number` \| `symbol`

• **R** = `ReturnType`\<`V`\[`K`\]\>

#### Parameters

• **type**: `K`

• **api**: `M`

• **id**: `string`

#### Returns

`Promise`\<`R`\>

#### Source

[internal/framework/src/state/ViewManager.ts:53](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L53)

***

### remove()

> **remove**(`microcosmID`, `id`): `Promise`\<`void`\>

#### Parameters

• **microcosmID**: `MicrocosmID`

• **id**: `string`

#### Returns

`Promise`\<`void`\>

#### Source

[internal/framework/src/state/ViewManager.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/2cff8cc/internal/framework/src/state/ViewManager.ts#L77)

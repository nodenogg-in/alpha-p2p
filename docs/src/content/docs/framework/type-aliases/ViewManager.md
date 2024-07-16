---
editUrl: false
next: false
prev: false
title: "ViewManager"
---

> **ViewManager**: `Object`

## Type declaration

### dispose()

> **dispose**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### register()

> **register**: \<`M`\>(`microcosm`, `app`, `view_id`) => `Promise`\<`View`\>

#### Type parameters

• **M** extends `MicrocosmAPI`

#### Parameters

• **microcosm**: `M`

• **app**: `App`\<`M`\>

• **view\_id**: `string`

#### Returns

`Promise`\<`View`\>

### remove()

> **remove**: (`microcosmID`, `view_id`) => `Promise`\<`void`\>

#### Parameters

• **microcosmID**: `MicrocosmID`

• **view\_id**: `string`

#### Returns

`Promise`\<`void`\>

## Source

[packages/framework/src/view-manager.ts:49](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/view-manager.ts#L49)

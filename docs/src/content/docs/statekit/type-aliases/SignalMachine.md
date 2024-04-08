---
editUrl: false
next: false
prev: false
title: "SignalMachine"
---

> **SignalMachine**\<`States`, `Events`, `D`\>: [`Signal`](Signal.md)\<`States`\> & `Object`

## Type declaration

### data

> **data**: [`Signal`](Signal.md)\<`D`\>

### is()

> **is**: (...`states`) => `boolean`

#### Parameters

• ...**states**: `States`[]

#### Returns

`boolean`

### send()

> **send**: (`event`, `d`?) => `void`

#### Parameters

• **event**: `Events`

• **d?**: `Partial`\<`D`\>

#### Returns

`void`

## Type parameters

• **States** extends `string`

• **Events** extends `string`

• **D** extends `object`

## Source

[api.ts:36](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/api.ts#L36)

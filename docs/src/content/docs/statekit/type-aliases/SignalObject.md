---
editUrl: false
next: false
prev: false
title: "SignalObject"
---

> **SignalObject**\<`R`, `K`\>: [`Signal`](Signal.md)\<`R`\> & `Object`

## Type declaration

### key()

> **key**: \<`K`\>(`key`) => [`Signal`](Signal.md)\<`R`\[`K`\]\>

#### Type parameters

• **K** extends keyof `R`

#### Parameters

• **key**: `K`

#### Returns

[`Signal`](Signal.md)\<`R`\[`K`\]\>

### keys

> **keys**: `K`[]

## Type parameters

• **R** extends `Record`\<`string`, `any`\>

• **K** extends keyof `R` = keyof `R`

## Source

[api.ts:20](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/packages/statekit/src/api.ts#L20)

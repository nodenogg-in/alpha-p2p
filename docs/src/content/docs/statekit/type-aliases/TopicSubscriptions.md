---
editUrl: false
next: false
prev: false
title: "TopicSubscriptions"
---

> **TopicSubscriptions**\<`T`\>: `Object`

## Type parameters

• **T** extends `string`

## Type declaration

### add()

> **add**: (`topic`, ...`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• **topic**: `T`

• ...**sub**: [`Subscription`](Subscription.md)[]

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### each()

> **each**: (`topic`, `value`) => `void`

#### Parameters

• **topic**: `T`

• **value**: `any`

#### Returns

`void`

## Source

[utils/subscriptions.ts:84](https://github.com/nodenogg-in/alpha-p2p/blob/bd4a66e/packages/statekit/src/utils/subscriptions.ts#L84)

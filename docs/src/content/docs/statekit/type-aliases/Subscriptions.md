---
editUrl: false
next: false
prev: false
title: "Subscriptions"
---

> **Subscriptions**\<`S`\>: `Object`

## Type parameters

• **S** extends [`Subscription`](Subscription.md) = [`Subscription`](Subscription.md)

## Type declaration

### add()

> **add**: (...`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• ...**sub**: `S`[]

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### delete()

> **delete**: (...`sub`) => `void`

#### Parameters

• ...**sub**: `S`[]

#### Returns

`void`

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### each()

> **each**: (`value`) => `void`

#### Parameters

• **value**: `any`

#### Returns

`void`

## Source

[utils/subscriptions.ts:42](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/utils/subscriptions.ts#L42)

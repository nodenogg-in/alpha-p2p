---
editUrl: false
next: false
prev: false
title: "Subscriptions"
---

> **Subscriptions**: `Object`

## Type declaration

### add()

> **add**: (...`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• ...**sub**: [`Subscription`](Subscription.md)[]

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### delete()

> **delete**: (`sub`) => `void`

#### Parameters

• **sub**: [`Subscription`](Subscription.md)

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

[utils/subscriptions.ts:44](https://github.com/nodenogg-in/alpha-p2p/blob/e7369be/packages/statekit/src/utils/subscriptions.ts#L44)

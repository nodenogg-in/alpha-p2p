---
editUrl: false
next: false
prev: false
title: "Events"
---

> **Events**\<`S`, `K`\>: `Object`

## Type parameters

• **S** extends `Record`\<`string`, `any`\>

• **K** extends `string` & keyof `S` = `string` & keyof `S`

## Type declaration

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

### emit()

> **emit**: \<`Key`\>(`key`, `value`) => `void`

#### Type parameters

• **Key** extends `K` = `K`

#### Parameters

• **key**: `Key`

• **value**: `S`\[`Key`\]

#### Returns

`void`

### on()

> **on**: \<`Key`\>(`key`, `sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Type parameters

• **Key** extends `K` = `K`

#### Parameters

• **key**: `Key`

• **sub**: [`Subscription`](Subscription.md)\<`S`\[`Key`\]\>

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### onAll()

> **onAll**: (`sub`) => [`Unsubscribe`](Unsubscribe.md)

#### Parameters

• **sub**: [`Subscription`](Subscription.md)\<`S`\>

#### Returns

[`Unsubscribe`](Unsubscribe.md)

### onMany()

> **onMany**: \<`TEventName`\>(`listeners`) => [`Unsubscribe`](Unsubscribe.md)

#### Type parameters

• **TEventName** extends `K`

#### Parameters

• **listeners**: `Record`\<`TEventName`, (`eventArg`) => `void`\>

#### Returns

[`Unsubscribe`](Unsubscribe.md)

## Source

[utils/events.ts:9](https://github.com/nodenogg-in/alpha-p2p/blob/8383a4b/packages/statekit/src/utils/events.ts#L9)

---
editUrl: false
next: false
prev: false
title: "Microcosms"
---

## Type parameters

• **M** extends `MicrocosmAPI`

## Constructors

### new Microcosms(factory, session, telemetry)

> **new Microcosms**\<`M`\>(`factory`, `session`, `telemetry`?): [`Microcosms`](Microcosms.md)\<`M`\>

#### Parameters

• **factory**: `MicrocosmAPIFactory`\<`M`\>

• **session**: [`Session`](Session.md)

• **telemetry?**: [`Telemetry`](Telemetry.md)

#### Returns

[`Microcosms`](Microcosms.md)\<`M`\>

#### Source

[internal/framework/src/state/Microcosms.ts:12](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L12)

## Properties

### factory

> **factory**: `MicrocosmAPIFactory`\<`M`\>

#### Source

[internal/framework/src/state/Microcosms.ts:13](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L13)

***

### microcosms

> **`readonly`** **microcosms**: `Map`\<`MicrocosmID`, `M`\>

#### Source

[internal/framework/src/state/Microcosms.ts:11](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L11)

## Methods

### delete()

> **delete**(`microcosmID`): `Promise`\<`void`\>

#### Parameters

• **microcosmID**: `MicrocosmID`

#### Returns

`Promise`\<`void`\>

#### Source

[internal/framework/src/state/Microcosms.ts:71](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L71)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[internal/framework/src/state/Microcosms.ts:80](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L80)

***

### register()

> **register**(`config`): `Promise`\<`M`\>

#### Parameters

• **config**: [`MicrocosmEntryRequest`](../type-aliases/MicrocosmEntryRequest.md)

#### Returns

`Promise`\<`M`\>

#### Source

[internal/framework/src/state/Microcosms.ts:18](https://github.com/nodenogg-in/alpha-p2p/blob/1896b55/internal/framework/src/state/Microcosms.ts#L18)

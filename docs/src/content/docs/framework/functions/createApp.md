---
editUrl: false
next: false
prev: false
title: "createApp"
---

> **createApp**\<`M`, `V`\>(`__namedParameters`): `Object`

## Type parameters

• **M** extends `MicrocosmAPI`

• **V** extends [`MicrocosmViews`](../type-aliases/MicrocosmViews.md) = [`MicrocosmViews`](../type-aliases/MicrocosmViews.md)

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters\.api**: `MicrocosmAPIFactory`\<`M`\>

• **\_\_namedParameters\.defaultView?**: keyof `V`

• **\_\_namedParameters\.telemetry?**: [`TelemetryOptions`](../type-aliases/TelemetryOptions.md)

• **\_\_namedParameters\.views**: `V`

## Returns

`Object`

### dispose()

> **dispose**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### microcosms

> **microcosms**: [`Microcosms`](../classes/Microcosms.md)\<`M`\>

### ready

> **ready**: `Signal`\<`boolean`\>

### session

> **session**: [`Session`](../classes/Session.md)

### telemetry

> **telemetry**: [`Telemetry`](../classes/Telemetry.md)

### ui

> **ui**: [`UI`](../classes/UI.md)

### views

> **views**: [`ViewManager`](../classes/ViewManager.md)\<`M`, `V`\>

## Source

[internal/framework/src/create-app.ts:19](https://github.com/nodenogg-in/alpha-p2p/blob/e46703f/internal/framework/src/create-app.ts#L19)

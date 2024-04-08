---
editUrl: false
next: false
prev: false
title: "TelemetryError"
---

## Extends

- `Error`

## Constructors

### new TelemetryError(data, origin)

> **new TelemetryError**(`data`, `origin`?): [`TelemetryError`](TelemetryError.md)

#### Parameters

• **data**: `EventData`

• **origin?**: `unknown`

#### Returns

[`TelemetryError`](TelemetryError.md)

#### Overrides

`Error.constructor`

#### Source

[internal/framework/src/state/Telemetry.ts:218](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L218)

## Properties

### data

> **data**: `EventData`

#### Source

[internal/framework/src/state/Telemetry.ts:219](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L219)

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node\_modules/.pnpm/typescript@5.4.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Source

node\_modules/.pnpm/typescript@5.4.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### origin?

> **`optional`** **origin**: `Error`

#### Source

[internal/framework/src/state/Telemetry.ts:217](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L217)

***

### stack?

> **`optional`** **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> **`static`** **`optional`** **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### Inherited from

`Error.prepareStackTrace`

#### Source

node\_modules/.pnpm/@types+node@18.19.26/node\_modules/@types/node/globals.d.ts:27

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@18.19.26/node\_modules/@types/node/globals.d.ts:29

## Methods

### captureStackTrace()

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Source

node\_modules/.pnpm/@types+node@18.19.26/node\_modules/@types/node/globals.d.ts:20

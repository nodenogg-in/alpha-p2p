---
editUrl: false
next: false
prev: false
title: "Telemetry"
---

Global app Telemetry

## Extends

- `State`\<`Object`\>

## Constructors

### new Telemetry()

> **new Telemetry**(): [`Telemetry`](Telemetry.md)

#### Returns

[`Telemetry`](Telemetry.md)

#### Overrides

`State<{ events: TelemetryEvent[] }>.constructor`

#### Source

[packages/framework/src/Telemetry.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L86)

## Properties

### dispose()

> **dispose**: () => `void`

#### Returns

`void`

#### Inherited from

`State.dispose`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:96

***

### events

> **events**: `Events`\<`Record`\<[`ErrorLevel`](../type-aliases/ErrorLevel.md), `string`\>, `"status"` \| `"info"` \| `"warn"` \| `"fail"`\>

#### Source

[packages/framework/src/Telemetry.ts:78](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L78)

***

### get()

> **get**: () => `Object`

#### Returns

`Object`

##### events

> **events**: `TelemetryEvent`[]

#### Inherited from

`State.get`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:92

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:83

***

### key()

> **key**: \<`K`\>(`key`) => `Signal`\<`Object`\[`K`\]\>

#### Type parameters

• **K** extends `"events"`

#### Parameters

• **key**: `K`

#### Returns

`Signal`\<`Object`\[`K`\]\>

#### Inherited from

`State.key`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:93

***

### logEvents

> **logEvents**: `boolean` = `true`

#### Source

[packages/framework/src/Telemetry.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L77)

***

### on()

> **on**: (`sub`) => `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

`State.on`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:95

***

### reset()

> **reset**: () => `void`

#### Returns

`void`

#### Inherited from

`State.reset`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:98

***

### set()

> **set**: (`partial`, `sync`?) => `void`

#### Parameters

• **partial**: `Object` \| `Partial`\<`Object`\> \| (`state`) => `Object` \| `Partial`\<`Object`\>

• **sync?**: `boolean`

#### Returns

`void`

#### Inherited from

`State.set`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:91

***

### signal

> **signal**: `SignalObject`\<`Object`, `"events"`\>

#### Type declaration

##### events

> **events**: `TelemetryEvent`[]

#### Inherited from

`State.signal`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:84

***

### use()

> **use**: (...`sub`) => `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

`State.use`

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:97

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

node\_modules/.pnpm/@figureland+statekit@0.0.27\_superjson@2.2.1\_vue@3.4.23\_typescript@5.3.3\_/node\_modules/@figureland/statekit/dist/index.d.ts:94

## Methods

### catch()

> **catch**(`e`): `void`

Catches the final error in a try...catch sequence

#### Parameters

• **e**: `unknown`

(optional) - event data

#### Returns

`void`

#### Source

[packages/framework/src/Telemetry.ts:205](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L205)

***

### init()

> **init**(`__namedParameters`): `void`

#### Parameters

• **\_\_namedParameters**: [`TelemetryOptions`](../type-aliases/TelemetryOptions.md)= `{}`

#### Returns

`void`

#### Source

[packages/framework/src/Telemetry.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L94)

***

### log()

> **log**(`e`): `void`

Logs an event

#### Parameters

• **e**: `EventData`

event data

#### Returns

`void`

#### Source

[packages/framework/src/Telemetry.ts:137](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L137)

***

### throw()

> **throw**(`e`?): `void`

Handles a thrown error

#### Parameters

• **e?**: `EventData`

(optional) - event data

#### Returns

`void`

#### Source

[packages/framework/src/Telemetry.ts:196](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L196)

***

### time()

> **time**(`e`): `Object`

Starts a timed event that is finished by calling .finish()

#### Parameters

• **e**: `EventData`

event data

#### Returns

`Object`

##### finish()

> **finish**: () => `void`

###### Returns

`void`

#### Source

[packages/framework/src/Telemetry.ts:181](https://github.com/nodenogg-in/alpha-p2p/blob/290bb7e02213a2b959571227ba7e64b04c8ddc90/packages/framework/src/Telemetry.ts#L181)

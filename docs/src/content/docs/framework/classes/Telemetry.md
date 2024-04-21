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

[internal/framework/src/state/Telemetry.ts:86](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L86)

## Properties

### events

> **events**: `Events`\<`Record`\<[`ErrorLevel`](../type-aliases/ErrorLevel.md), `string`\>, `"info"` \| `"warn"` \| `"fail"` \| `"status"`\>

#### Source

[internal/framework/src/state/Telemetry.ts:78](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L78)

***

### id

> **`readonly`** **id**: `string`

#### Inherited from

`State.id`

#### Source

[packages/statekit/src/State.ts:22](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L22)

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

[packages/statekit/src/State.ts:63](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L63)

***

### logEvents

> **logEvents**: `boolean` = `true`

#### Source

[internal/framework/src/state/Telemetry.ts:77](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L77)

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

[packages/statekit/src/State.ts:56](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L56)

***

### signal

> **signal**: `SignalObject`\<`Object`, `"events"`\>

#### Type declaration

##### events

> **events**: `TelemetryEvent`[]

#### Inherited from

`State.signal`

#### Source

[packages/statekit/src/State.ts:23](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L23)

## Accessors

### keys

> **`get`** **keys**(): `K`[]

#### Returns

`K`[]

#### Source

[packages/statekit/src/State.ts:65](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L65)

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

[internal/framework/src/state/Telemetry.ts:205](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L205)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`State.dispose`

#### Source

[packages/statekit/src/State.ts:73](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L73)

***

### get()

> **get**(): `Object`

#### Returns

`Object`

##### events

> **events**: `TelemetryEvent`[]

#### Inherited from

`State.get`

#### Source

[packages/statekit/src/State.ts:61](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L61)

***

### init()

> **init**(`__namedParameters`): `void`

#### Parameters

• **\_\_namedParameters**: [`TelemetryOptions`](../type-aliases/TelemetryOptions.md)= `{}`

#### Returns

`void`

#### Source

[internal/framework/src/state/Telemetry.ts:94](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L94)

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

[internal/framework/src/state/Telemetry.ts:137](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L137)

***

### on()

> **on**(`sub`): `Unsubscribe`

#### Parameters

• **sub**

#### Returns

`Unsubscribe`

#### Inherited from

`State.on`

#### Source

[packages/statekit/src/State.ts:70](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L70)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Inherited from

`State.reset`

#### Source

[packages/statekit/src/State.ts:90](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L90)

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

[internal/framework/src/state/Telemetry.ts:196](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L196)

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

[internal/framework/src/state/Telemetry.ts:181](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/internal/framework/src/state/Telemetry.ts#L181)

***

### use()

> **use**(...`sub`): `Unsubscribe`

#### Parameters

• ...**sub**: `Unsubscribe`[]

#### Returns

`Unsubscribe`

#### Inherited from

`State.use`

#### Source

[packages/statekit/src/State.ts:87](https://github.com/nodenogg-in/alpha-p2p/blob/aa60360/packages/statekit/src/State.ts#L87)

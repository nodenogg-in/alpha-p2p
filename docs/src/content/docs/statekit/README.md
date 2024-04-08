---
editUrl: false
next: false
prev: false
title: "@nodenogg.in/statekit"
---

This library provides a simple toolkit of primitives for building simple but powerful apps and systems driven by data, events and messages.

## Examples and API

There are five raw ingredients in this library:

- `Signal<V extends any>(() => V)` creates a subscribable signal that holds a single value
- `SignalObject<V extends object>(V)`: create a collection of signals from an object
- `createEvents<R extends Record<string, any>>(R)`: create a generic typed event emitter
- `createSubscriptions()`: manages a list of subscriptions
- `createTopicSubscriptions<K extends string>()` manages keyed lists of subscriptions for 'topics'

### `Signal<V>(() => V)`

```ts
import { signal } from '@nodenogg.in/statekit'

const v = signal(() => 0)

v.set(0) // set value to 0

v.set('m') // ts error

v.on((newValue: number) => {
  // ...
})

v.get() // returns 0
```

#### Deriving Signals

If you want to create new signals derived from other signals, you can use the first argument in the initialiser function. You can wrap this around any other signals, states or reactive objects from this library. It will pick up the dependencies and update automatically whenever they change.

```ts
import { signal } from '@nodenogg.in/statekit'

const x = signal(() => 2)
const y = signal(() => 1)
const pos = signal((get) => ({
  x: get(x),
  y: get(x)
}))

post.on((newValue: { x: number; y: number }) => {
  // ...subscribes to the derived new value,
  // updates whenever x or y are updated
})
```

#### Equality

This library encourages you to decide yourself how a signal value has changed. You can do this using a custom equality check function. By default, signal does a basic shallow equality check to see if the value has changed.

```ts
import { signal } from '@nodenogg.in/statekit'

const num = signal(() => 0, {
  equality: (a, b) => a === b
})
```

#### Merging

If you have an object complex nested state, you can provide your own custom merging function. By default, if the value is an object, it will use a simple `(a, b) => ({ ...a, ...b })` merge. More complex object-like variables such as `Map`, `Set`, or Arrays won't be merged unless you want them to. Something like [`deepmerge-ts`](https://github.com/RebeccaStevens/deepmerge-ts) could be a good way to do that.

```ts
import { signal } from '@nodenogg.in/statekit'
import customMerge from './custom-merge'

const obj = signal(() => ({ x: 0, y: [{ a: 1, b: '2', c: { x: 1 } }] }), {
  merge: customMerge
})
```

### `SignalObject<O extends Object>(O)`

`signalObject()` takes an object and turns it into a collection of signals that can be subscribed to individually or as a collection.

```ts
import { signalObject } from '@nodenogg.in/statekit'

const v = signalObject({ x: 0, y: '1', z: ['b'] })

v.key('x') // returns a signal() with inferred typing
v.key('x').set(0) // set value of v.x to 0
v.key('x').set('m') // ts error

v.get() // return whole object ({ x: 0, y: '1', z: ['b']})

v.on((newValue: { x: number; y: string; z: string[] }) => {
  // ...subscribes to all signals
})

v.key('z').on((newValue: string[]) => {
  // ...subscribes to a particular key
})
```

### `new State<O extends object>`

This is a simple foundation class which you can use as the basis for a stateful pattern within an app to which other parts of the codebase can subscribe. This pattern can be useful if you find a store is getting very big, or if you want more sophisticated logic, other dependencies or derived state that could benefit from being wrapped up in the same class.

```ts
import { State } from '@nodenogg.in/statekit'

class Pointer extends State<{ x: number; y: number }> {
  constructor(x: number, y: number) {
    super({
      initial: () => ({ x, y }),
      // You can persist the value of the state to local storage
      persistence: {
        name: ['local-storage-name'],
        validate: (v: unknown) => !isNaN(v?.x) && !isNaN(v?.y), // validate storage for type safety
        syncTabs: true, // sync state between browser tabs
        interval: 0 // save at certain intervals
      }
    })
  }
}

export const pointer = new Pointer(0, 0)

pointer.set({ x: 10, y: 100 })

pointer.key('x').set(10)

// Which in terms of reactive state is the same as this:

export const pointer = signalObject({ x: 0, y: 0 })

// However, type checking is a lot more straightforward when you can do this:

if (pointer instanceof Pointer) {
  // ...type safe
}

const usePointerEvent = (pointer: Pointer) => //...

// Rather than this

const usePointerSignalEvent = (pointer: Signal<{ x: number, y: number }>) => //...

// You can use the SignalType helper to infer the signal type though...

type Pointer = SignalType<typeof pointer>

```

You can then subscribe to the state in your front-end code.

```ts
import { useState } from '@nodenogg.in/statekit'
import { pointer } from './pointer'

const PointerComponent = () => {
    const pointer = useState(pointer)

    return (
        <div>
            {JSON.stringify(pointer)}
        </div>
    )
}

// <div>{"x": 0, "y": 0}</div>

const XComponent = () => {
    const x = useState(pointer, 'x')

    return (
        <div>
            {JSON.stringify(x)}
        </div>
    )
}

// <div>1</div>
```

## Why?

The main motivation behind this library was regularly finding the need to create complex app states and dataflows but getting too locked down into a specific framework or library, then hitting performance and memory usage thresholds when the front-end runtime (looking at you React) feels like its trying to do too much.

Perhaps you have some app logic that needs to run as both a standalone app and a component. Perhaps your state has lots and lots of updates (60fps) or complex intermediary values and you are wisely keeping that out of your components and React's render loop. Or maybe you want to run your state on a server in node.js as well as in browser. Maybe you're using React for now but like the idea of being able to ditch it in the future! Or maybe you just want to add a sprinkling of low-calorie messaging and reactive state without feeling like you need to shackle yourself to some enormous new dependency.

It also provides an useful, opinionated pattern for creating stateful/subscribable ES6+ Classes, of which there is a basic example below. This allows your state to live on its own rather than tangled up inside your UI code, for example, in a `useState`/`useEffect` hook.

When it comes to rendering things, you can subscribe to whatever is needed from the front-end framework code using a series of thin wrappers just pass on the value rather than creating a reactive duplicate. Currently there are wrappers for `react`, `vue` and `svelte`.

Most people will probably want to stick to the many excellent tried and tested state management solutions, but this might be interesting for anyone who likes cooking without a recipe.

Note: This is a project that is primarily about learning through making so there are no claims of superior performance or completeness in comparison to other approaches. For that, have a look at much more powerful and comprehensive solutions to similar problems, such as like:

- Toxi's brilliant [thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [Preact Signals](https://github.com/preactjs/signals/tree/main)
- [Solid Signals](https://www.solidjs.com/tutorial/introduction_signals)

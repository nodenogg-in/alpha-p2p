import { State } from './State'

type MachineUpdate = <E extends object>(state: E) => E

export class StateMachine<
  E,
  S extends Record<string, (s: E) => E>,
  I extends K,
  K extends string & keyof S = string & keyof S
> extends State<{
  data: E
  state: K
}> {
  states: S

  constructor({ states, initial, data }: { data: E; initial: I; states: S }) {
    super({
      initial: () => ({
        state: initial,
        data
      })
    })
    this.states = states
  }

  public transition = <Key extends K, U extends E>(
    newState: Key,
    fn: (v: { state: K; data: E }) => U
  ) => {
    !!this.states[newState] &&
      this.set((previous) => ({
        state: newState,
        value: fn(previous)
      }))
  }

  public is = <Key extends K>(state: Key, fn?: (data: E) => void) => {
    const isInState = this.getKey('state') === state
    if (isInState && fn) {
      fn(this.getKey('data'))
    }
    return {
      or: <Key extends K>(state: Key, fn?: (data: E) => void) => !isInState && this.is(state, fn)
    }
  }
}

const machine = new StateMachine({
  data: { value: 10 },
  initial: 'idle',
  states: {
    idle: (state) => state,
    active: (state) => state
  }
})

machine
  .is('idle', ({ value }) => {
    console.log('do something with idle')
  })
  .or('active', () => {
    console.log('do something with active')
  })

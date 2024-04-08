import type { SignalMachine, SignalMachineTransitions } from './api'
import { signal } from './signal'

/**
 *
 * Creates a really basic {@link Signal}-based finite state machine that can transition between states
 *
 * @param initialState
 * @param transitions
 * @returns
 */
export const machine = <States extends string, Events extends string, D extends object>(
  initialState: States,
  transitions: SignalMachineTransitions<States, Events, D>,
  dataStore: () => D = () => ({}) as D
): SignalMachine<States, Events, D> => {
  const data = signal<D>(dataStore)
  const machineSignal = signal<States>(() => initialState, {
    merge: (_prev, next) => next
  })

  const send = (event: Events, d?: Partial<D>): void => {
    machineSignal.set((currentState) => {
      const stateTransitions = transitions[currentState].on
      const { enter, exit } = transitions[currentState]
      if (stateTransitions) {
        const nextState = stateTransitions[event] as States | undefined
        if (d) {
          data.set((prev) => ({ ...prev, ...d }))
        }
        if (enter && nextState) {
          enter(data, event, currentState)
        }
        if (exit && nextState) {
          exit(data, event, nextState)
        }
        return nextState ?? currentState
      } else {
        return currentState
      }
    })
  }

  const is = (...states: States[]): boolean => states.includes(machineSignal.get())

  return {
    ...machineSignal,
    data,
    is,
    send
  }
}

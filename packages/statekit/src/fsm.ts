import type { SignalFSM } from '.'
import { signal } from './signal'

/**
 *
 * Creates a basic {@link Signal}-based finite state machine that can transition between states
 *
 * @param initialState
 * @param transitions
 * @returns
 */
export const fsm = <States extends string, Events extends string>(
  initialState: States,
  transitions: {
    [State in States]: {
      on?: {
        [Event in Events]?: States
      }
    }
  }
): SignalFSM<States, Events> => {
  const fsmSignal = signal<States>(() => initialState, {
    merge: (_prev, next) => next
  })

  const send = (event: Events): void => {
    fsmSignal.set((currentState) => {
      const stateTransitions = transitions[currentState].on
      if (stateTransitions) {
        const nextState = stateTransitions[event] as States | undefined
        return nextState ?? currentState
      } else {
        return currentState
      }
    })
  }

  const isIn = (...states: States[]): boolean => states.includes(fsmSignal.get())

  return {
    ...fsmSignal,
    isIn,
    send
  }
}

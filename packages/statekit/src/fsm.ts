import type { SignalFSM } from '.'
import { signal } from './signal'

export const fsm = <States extends string, Events extends string>(
  initialState: States,
  transitions: {
    [State in States]: {
      [Event in Events]?: States
    }
  }
): SignalFSM<States, Events> => {
  const fsmSignal = signal<States>(() => initialState, {
    merge: (_prev, next) => next
  })

  const transition = (event: Events): void => {
    fsmSignal.set((currentState) => {
      const nextState = transitions[currentState][event] as States | undefined
      return nextState ?? currentState
    })
  }

  return {
    ...fsmSignal,
    transition
  }
}

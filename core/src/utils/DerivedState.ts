import { State, type StateOptions, type StateType } from './State'

export class DerivedState<States extends State<any>[], R extends object> extends State<R> {
  constructor(
    states: [...States],
    derive: (
      ...states: {
        [K in keyof States]: StateType<States[K]>
      }
    ) => R,
    options: Omit<StateOptions<R>, 'initial'> = {}
  ) {
    const load = (): R =>
      derive(
        ...(states.map((state) => state.get()) as {
          [K in keyof States]: StateType<States[K]>
        })
      )
    super({
      initial: load,
      ...options
    })
    this.onDispose(...states.map((s) => s.on(() => this.set(load()))))
  }
}

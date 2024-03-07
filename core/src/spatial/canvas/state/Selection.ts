import { State } from '../../../utils'

export type SelectionState = {
  nodes: string[]
  target: string | null
}

export class Selection extends State<SelectionState> {
  constructor() {
    super({
      initial: (): SelectionState => ({
        nodes: [],
        target: null
      }),
      throttle: 8
    })
  }
  public reset = (withNodes: boolean = true) => {
    this.set({
      ...this.initial(),
      nodes: withNodes ? this.getKey('nodes') : []
    })
  }
}

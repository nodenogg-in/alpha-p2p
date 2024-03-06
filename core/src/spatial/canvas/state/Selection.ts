import { Selection } from '../../../schema'
import { State } from '../../../utils'

const defaultSelectionState = (): Selection => ({
  nodes: [],
  target: null
})

export class SelectionState extends State<Selection> {
  constructor() {
    super({
      initial: defaultSelectionState,
      throttle: 8
    })
  }
  public reset = (withNodes: boolean = true) => {
    this.set({
      ...defaultSelectionState(),
      nodes: withNodes ? this.getKey('nodes') : []
    })
  }
}

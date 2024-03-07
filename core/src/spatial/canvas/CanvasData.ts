import type { Microcosm } from '../../sync'
import { State } from '../../utils'

export type CanvasDataState = {
  collections: string[]
}

export class CanvasData<M extends Microcosm = Microcosm> extends State<CanvasDataState> {
  microcosm: M
  constructor(microcosm: M) {
    super({
      initial: () => ({
        collections: []
      })
    })
    this.microcosm = microcosm
    // this.onDispose(this.microcosm.api.subscribeToCollections((c) => this.setKey('collections', c)))
  }
}

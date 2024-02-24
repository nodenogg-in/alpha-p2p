import type { Microcosm, ReadonlyMicrocosmAPI } from './api'
import { CanvasInteractionState } from '../../spatial/CanvasInteractionState'

export class ReadonlyMicrocosm<M extends ReadonlyMicrocosmAPI = ReadonlyMicrocosmAPI>
  implements Microcosm<M>
{
  public readonly microcosm_uri: string
  public readonly api: M
  public readonly canvas = new CanvasInteractionState()

  constructor(api: M) {
    this.api = api
  }

  public dispose = () => {
    this.canvas.dispose()
    this.api.dispose()
  }
}

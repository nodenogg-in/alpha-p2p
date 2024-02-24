import type { EditableMicrocosmAPI, Microcosm } from './api'
import { CanvasActions } from '../../spatial'
import { CanvasInteraction } from '../../spatial/CanvasInteraction'

export class EditableMicrocosm<M extends EditableMicrocosmAPI = EditableMicrocosmAPI>
  implements Microcosm<M>
{
  public readonly api: M
  public readonly canvas: CanvasInteraction
  public readonly actions: CanvasActions

  constructor(api: M) {
    this.api = api
    this.canvas = new CanvasInteraction()
    this.actions = new CanvasActions(this)
  }

  public dispose = () => {
    this.api.leave()
    this.canvas.dispose()
    this.actions.dispose()
    this.api.dispose()
  }
}

import type { EditableMicrocosmAPI, Microcosm } from './api'
import { CanvasActions } from '../../spatial'
import { CanvasInteractionState } from '../../spatial/CanvasInteractionState'

export class EditableMicrocosm<M extends EditableMicrocosmAPI = EditableMicrocosmAPI>
  implements Microcosm<M>
{
  public readonly api: M
  public readonly canvas = new CanvasInteractionState()
  public readonly actions: CanvasActions

  constructor(api: M) {
    this.api = api
    this.actions = new CanvasActions(this)
  }

  public dispose = () => {
    this.api.leave()
    this.canvas.dispose()
    this.actions.dispose()
    this.api.dispose()
  }
}

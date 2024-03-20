import { EditableMicrocosmAPI, MicrocosmAPI } from '../sync'
import { CanvasActions } from './CanvasActions'
import { CanvasInteractionState } from './CanvasInteractionState'

interface SpatialView<M extends MicrocosmAPI = MicrocosmAPI> {
  api: M
}

export class EditableSpatialView<M extends EditableMicrocosmAPI = EditableMicrocosmAPI>
  implements SpatialView<M>
{
  public readonly api: M
  public readonly canvas = new CanvasInteractionState()
  public readonly actions: CanvasActions

  constructor(api: M) {
    this.api = api
    this.actions = new CanvasActions(this)
  }

  public dispose = () => {
    this.canvas.dispose()
    this.actions.dispose()
  }
}

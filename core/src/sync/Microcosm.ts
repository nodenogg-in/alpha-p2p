import type { ViewName } from '../schema'
import type { EditableMicrocosmAPI, MicrocosmAPI, ReadonlyMicrocosmAPI } from './api'
import { CanvasActions } from '../spatial'
import { CanvasInteraction } from '../spatial/CanvasInteraction'

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewName
  user_id: string
  password?: string
}

export interface Microcosm<M extends MicrocosmAPI = MicrocosmAPI> {
  api: M
  canvas: CanvasInteraction
}

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

export class ReadonlyMicrocosm<M extends ReadonlyMicrocosmAPI = ReadonlyMicrocosmAPI>
  implements Microcosm<M>
{
  public readonly microcosm_uri: string
  public readonly api: M
  public readonly canvas = new CanvasInteraction()

  constructor(api: M) {
    this.api = api
  }

  public dispose = () => {
    this.canvas.dispose()
    this.api.dispose()
  }
}

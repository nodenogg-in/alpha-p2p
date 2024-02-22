import { ViewName } from '../schema'
import { CanvasActions } from '../spatial'
import { CanvasInteraction } from '../spatial/CanvasInteraction'
import { MicrocosmAPIFactory } from './Microcosms'
import { MicrocosmAPI, isEditableMicrocosmAPI } from './api'

export type MicrocosmConfig = {
  microcosm_uri: string
  view: ViewName
  user_id: string
  password?: string
}

export class Microcosm<M extends MicrocosmAPI = MicrocosmAPI> {
  public api: M
  public canvas = new CanvasInteraction()
  public actions: CanvasActions

  constructor(factory: MicrocosmAPIFactory<M>, opts: MicrocosmConfig) {
    this.api = factory(opts)
    this.actions = new CanvasActions(this.api)
  }

  public dispose = () => {
    if (isEditableMicrocosmAPI(this.api)) {
      this.api.leave()
    }
    this.canvas.dispose()
    this.actions.dispose()
    this.api.dispose()
  }
}

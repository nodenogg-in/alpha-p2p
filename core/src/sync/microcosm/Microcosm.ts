import { getPersistenceName } from '../../app'
import { Canvas, EditableCanvas } from '../../spatial'
import { State, values } from '../../utils'
import { isEditableMicrocosmAPI } from './MicrocosmAPI'
import type { EditableMicrocosmAPI, MicrocosmAPI } from './api'

type MicrocosmState = {
  active: string | null
}
export class Microcosm<M extends MicrocosmAPI = MicrocosmAPI> extends State<MicrocosmState> {
  public api: M
  public microcosm_uri: string
  public readonly views = {
    spatial: new Map<string, Canvas | EditableCanvas>()
  }

  constructor(api: M) {
    super({
      initial: () => ({
        active: null
      })
    })
    this.api = api
    this.microcosm_uri = api.microcosm_uri
  }

  public getReadonlyView = (id: string) => {
    const view = new Canvas(this, { persist: getPersistenceName(['view', 'spatial', id]) })
    this.views.spatial.set(id, view)
    return view
  }

  public getEditableView = (id: string) => {
    try {
      if (!this.isEditable()) {
        throw new Error('Microcosm is not editable')
      }
      const view = new EditableCanvas(this, {
        persist: getPersistenceName(['view', 'spatial', id])
      })
      this.views.spatial.set(id, view)
      return view
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public isEditable = (): this is Microcosm<EditableMicrocosmAPI> =>
    isEditableMicrocosmAPI(this.api)

  /**
   * Retrieves nodes that intersect with a given point and box
   */
  public dispose = () => {
    for (const viewType of values(this.views)) {
      for (const canvas of viewType.values()) {
        canvas.dispose()
      }
    }
  }
}

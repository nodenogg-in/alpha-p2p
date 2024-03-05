import type { Box, Vec2, ViewType } from '../../schema'
import { type EditableMicrocosmAPI, type MicrocosmAPI, isEditableMicrocosmAPI } from '../api.schema'
import { getPersistenceName } from '../../app'
import { BoxEdgeProximity, Canvas } from '../../spatial'
import { resizeBoxes } from '../../spatial/canvas/geometry'
import { State, values } from '../../utils'
import { Instance } from '../../app/Instance'

export class Microcosm<M extends MicrocosmAPI = MicrocosmAPI> extends State<{
  active: string | null
}> {
  public api: M
  public microcosm_uri: string
  public readonly views = {
    spatial: new Map<string, Canvas>()
  }

  constructor(api: M) {
    super({
      initial: () => ({
        active: null
      })
    })
    this.api = api
    this.microcosm_uri = api.microcosm_uri

    this.onDispose(() => {
      for (const viewType of values(this.views)) {
        for (const canvas of viewType.values()) {
          canvas.dispose()
        }
      }
    })
  }

  public isActive = () => Instance.app.isActive(this.microcosm_uri)

  public join = () => {
    if (this.isEditable()) {
      this.api.join(Instance.app.user.getKey('username'))
    }
  }

  public leave = () => {
    if (this.isEditable()) {
      this.api.leave(Instance.app.user.getKey('username'))
    }
  }

  private setupListeners = () => {
    this.onDispose(
      Instance.app.user.onKey('username', () => {
        this.join()
      }),
      Instance.ui.keyboard.onCommand({
        redo: () => {
          if (this.isActive() && this.isEditable()) {
            this.api.redo()
          }
        },
        undo: () => {
          if (this.isActive() && this.isEditable()) {
            this.api.undo()
          }
        }
      })
    )
  }
  public getCanvas = (id: string): Canvas<this> => {
    if (this.views.spatial.has(id)) {
      return this.views.spatial.get(id) as Canvas<this>
    }
    const view = new Canvas(this, { persist: getPersistenceName(['microcosm', id, 'spatial']) })
    this.views.spatial.set(id, view)
    return view
  }

  public update: EditableMicrocosmAPI['update'] = (...u) => {
    if (this.isEditable()) {
      console.log()
    }
  }

  public move = (node_ids: string[], { x, y }: Vec2) => {
    if (this.isEditable()) {
      for (const node_id of node_ids) {
        this.api.patch(node_id, 'html', (node) => ({ x: node.x + x, y: node.y + y }))
      }
    }
  }

  public resize = (boundingBox: Box, node_ids: string[], delta: Vec2, edge: BoxEdgeProximity) => {
    if (this.isEditable()) {
      const nodes = this.api.nodes('html').filter(([id]) => node_ids.includes(id))

      const resized = resizeBoxes(nodes, edge, delta, 'html')
      this.api.update(resized as any)
    }
  }

  public isEditable = (): this is Microcosm<EditableMicrocosmAPI> =>
    isEditableMicrocosmAPI(this.api)
}

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
}

export type MicrocosmFactory<M extends Microcosm = Microcosm> = (args: MicrocosmConfig) => M

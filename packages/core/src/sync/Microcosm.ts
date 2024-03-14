import { type Box, type Vec2, type ViewType, isNodeReferenceType, NodeReference } from '../schema'
import {
  type EditableMicrocosmAPI,
  type MicrocosmAPI,
  isEditableMicrocosmAPI
} from './MicrocosmAPI.schema'
import { type BoxEdgeProximity, Canvas, intersectBoxWithBox } from '../spatial'
import { resizeBoxes } from '../spatial/canvas/geometry'
import { NiceMap, values } from '@nodenogg.in/utils'
import { State, deriveState, equals } from '@nodenogg.in/state'
import { Instance } from '../app/Instance'

export class Microcosm<M extends MicrocosmAPI = MicrocosmAPI> extends State<{
  active: string | null
}> {
  public microcosm_uri: string
  public readonly views = new NiceMap<string, Canvas>()

  constructor(public api: M) {
    super({
      initial: () => ({
        active: null
      })
    })
    this.microcosm_uri = api.microcosm_uri
    this.onDispose(
      () => {
        for (const viewType of values(this.views)) {
          for (const canvas of viewType.values()) {
            canvas.dispose()
          }
        }
      },
      Instance.session.user.on(() => {
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

    if (this.isEditable()) {
      this.onDispose(
        this.api.onKey('status', ({ connected }) => {
          if (connected) this.join()
        }),
        Instance.session.onKey('active', (active) => {})
      )
    }
  }

  public isActive = () => Instance.session.isActive(this.microcosm_uri)

  public join = () => {
    if (this.isEditable()) {
      Instance.telemetry.log({
        name: 'Microcosm',
        message: `Joined ${this.microcosm_uri}`,
        level: 'info'
      })
      this.api.join(Instance.session.user.getKey('username'))
    }
  }

  /**
   * Leave the microcosm
   */
  public leave = () => {
    if (this.isEditable()) {
      Instance.telemetry.log({
        name: 'microcosm',
        message: `Left: ${this.microcosm_uri}`,
        level: 'info'
      })
      this.api.leave(Instance.session.user.getKey('username'))
    }
  }

  /**
   * Returns a Canvas view
   */
  public getCanvas = (id: string) => {
    const timer = Instance.telemetry.time({
      name: 'Microcosms',
      message: `Created canvas view for ${id}`,
      level: 'info'
    })
    const view = this.views.getOrSet<Canvas<this>>(
      id,
      () =>
        new Canvas(this, {
          persist: Instance.getPersistenceName(['microcosm', id, 'spatial'])
        })
    )
    timer.finish()
    return view
  }

  /**
   * Update the microcosm
   */
  public update: EditableMicrocosmAPI['update'] = (...u) => {
    if (this.isEditable()) {
      console.log(u)
    }
  }

  /**
   * Move a collection of nodes
   */
  public move = (node_ids: string[], { x, y }: Vec2) => {
    if (this.isEditable()) {
      for (const node_id of node_ids) {
        this.api.patch<'html'>(node_id, (node) => ({ x: node.x + x, y: node.y + y }))
      }
    }
  }

  public resize = (boundingBox: Box, node_ids: string[], delta: Vec2, edge: BoxEdgeProximity) => {
    if (this.isEditable()) {
      const nodes = this.api.nodes('html').filter(([id]) => node_ids.includes(id))

      const resized = resizeBoxes(nodes, edge, delta)
      this.api.update(...resized)
    }
  }

  public isEditable = (): this is Microcosm<EditableMicrocosmAPI> =>
    isEditableMicrocosmAPI(this.api)

  public subscribeToCollection = (canvas: Canvas, user_id: string) => {
    const nodesState = this.api.subscribeToCollection(user_id)

    const state = deriveState(
      [canvas.interaction.viewport, nodesState],
      ([viewport, { nodes }]) => ({
        nodes: nodes
          .filter((n) => isNodeReferenceType(n, 'html'))
          .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      }),
      {
        equality: equals.basic
      }
    )

    this.onDispose(state.dispose)
    return state
  }

  public destroy = () => {
    if (this.isEditable()) {
      this.api.destroy()
    }
    this.dispose()
  }
}

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
}

export type MicrocosmFactory<M extends Microcosm = Microcosm> = (args: MicrocosmConfig) => M

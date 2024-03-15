import {
  IdentityWithStatus,
  NewNode,
  Node,
  NodeReference,
  NodeType,
  ViewType
} from '@nodenogg.in/schema'
import {
  BoxReference,
  Canvas,
  DEFAULT_BOX_SIZE,
  Vec2,
  generateBoxPositions,
  getViewCenter
} from '@nodenogg.in/spatial-view'
import { State } from '@nodenogg.in/state'
import { NiceMap } from '@nodenogg.in/utils'
import { Instance } from '../app'
import { NodePatch, NodeUpdate } from './utils/update'
import { parseFileToHTML, parseFilesToHTML } from '@nodenogg.in/parsers'

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
}

export interface View {
  id: string
  dispose: () => void
}

export type MicrocosmStatus = {
  ready: boolean
  connected: boolean
}

export type MicrocosmEvents = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  collections: string[]
  active: boolean
}

export class BaseMicrocosm extends State<MicrocosmEvents> {
  public readonly microcosm_uri: string
  protected readonly views = new NiceMap<string, Canvas>()
  protected password?: string
  protected readonly user_id: string

  /**
   * Creates a new microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor({ microcosm_uri, user_id, password }: MicrocosmConfig) {
    super({
      initial: () => ({
        status: {
          connected: false,
          ready: false
        },
        identities: [],
        collections: [],
        active: false
      })
    })
    this.password = password
    this.user_id = user_id
    this.microcosm_uri = microcosm_uri

    this.onDispose(
      () => {
        for (const view of this.views.values()) {
          view.dispose()
        }
      },
      Instance.session.user.on(() => {
        if (this.isEditable()) {
          this.join()
        }
      }),
      Instance.ui.keyboard.onCommand({
        redo: () => {
          console.log('want to redo')
          if (this.isActive() && this.isEditable()) {
            console.log('attempting redo')
            this.redo()
            console.log('done redo')
          }
        },
        undo: () => {
          console.log('want to undo')
          if (this.isActive() && this.isEditable()) {
            console.log('attempting undo')
            this.undo()
            console.log('done undo')
          }
        }
      })
    )

    if (this.isEditable()) {
      this.onDispose(
        this.onKey('status', ({ connected }) => {
          if (connected) this.join()
        }),
        Instance.session.onKey('active', (active) => {})
      )
    }
  }

  public boxes: () => BoxReference[]

  public isActive = () => Instance.session.isActive(this.microcosm_uri)

  public getCanvas = (id: string) => {
    const view = this.views.getOrSet(id, () => this.createCanvas(id))
    return view
  }

  public onDropFiles = async (files: File[], origin: Vec2) => {
    if (this.isEditable()) {
      const converted = await parseFilesToHTML(files)
      const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, converted)

      const nodes = converted.map((node, i) => ({
        ...node,
        ...positions[i]
      }))

      this.create(nodes)
    }
  }

  private createCanvas = (id: string) => {
    const timer = Instance.telemetry.time({
      name: 'Microcosm',
      message: `Created view for ${id} in ${this.microcosm_uri}`,
      level: 'info'
    })

    const canvas = new Canvas(this, id, Instance.getPersistenceName(['microcosm', 'spatial', id]))

    this.onDispose(
      Instance.ui.screen.onKey('pointer', canvas.update),
      Instance.ui.keyboard.onCommand({
        all: () => {
          if (canvas.isActive()) {
            canvas.select()
          }
        },
        h: () => {
          if (canvas.isActive()) {
            canvas.setTool('move')
          }
        },
        v: () => {
          if (canvas.isActive()) {
            canvas.setTool('select')
          }
        },
        n: () => {
          if (canvas.isActive()) {
            canvas.setTool('new')
          }
        },
        c: () => {
          if (canvas.isActive()) {
            canvas.setTool('connect')
          }
        },
        backspace: () => {
          if (canvas.isActive()) {
            console.log('backspace')
          }
        },
        space: () => {
          if (canvas.isActive()) {
            canvas.setTool('move')
          }
        }
      })
    )

    timer.finish()
    return canvas
  }

  public isEditable = (): this is EditableMicrocosm => 'leave' in this
}

export interface Microcosm extends BaseMicrocosm {
  dispose: () => void
  getCanvas: (id: string) => Canvas<this>
  node: <T extends NodeType>(node_id: string, type?: T) => Node<T> | undefined
  nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]
  getCollections: () => string[]
  subscribeToCollection: (user_id: string) => State<{ nodes: NodeReference[] }>
  getCollection: (user_id: string) => NodeReference[]
  boxes: () => BoxReference[]
}

export type EditableMicrocosm = Microcosm & {
  clearPersistence: (reset?: boolean) => void
  deleteAll: () => void
  create: (n: NewNode | NewNode[]) => Promise<string | string[]>
  patch: <T extends NodeType>(node_id: string, patch: NodePatch<T>) => void
  update: <T extends NodeType>(...u: [string, NodeUpdate<T>][]) => void
  delete: (node_id: string) => void
  join: (username?: string) => void
  leave: (username?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}

export type MicrocosmFactory<M extends Microcosm = Microcosm> = (args: MicrocosmConfig) => M

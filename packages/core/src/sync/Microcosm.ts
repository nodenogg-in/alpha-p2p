import { FileImporter, type ParsedNode, isParsedNodeType } from '@nodenogg.in/parsers'
import type {
  IdentityWithStatus,
  NewNode,
  Node,
  NodeReference,
  NodeType,
  ViewType
} from '@nodenogg.in/schema'
import {
  type BoxReference,
  type Vec2,
  Canvas,
  DEFAULT_BOX_SIZE,
  generateBoxPositions
} from '@nodenogg.in/spatial-view'
import { State } from '@nodenogg.in/state'
import type { NodePatch, NodeUpdate } from './utils/update'
import { NiceMap } from '@nodenogg.in/utils'
import { Instance } from '../app'
import { EditableMicrocosm } from './api'

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
      const importer = new FileImporter()
      const converted = await importer.parseFiles(files)

      const htmlNodes = converted.filter((n) => isParsedNodeType(n, 'html')) as ParsedNode<'html'>[]

      const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

      const nodes = htmlNodes.map((node, i) => ({
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

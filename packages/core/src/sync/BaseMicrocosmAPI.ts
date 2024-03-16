import { type ParsedNode, isParsedNodeType, Importer } from '@nodenogg.in/parsers'
import type { IdentityWithStatus, ViewType } from '@nodenogg.in/schema'
import {
  type BoxReference,
  type Vec2,
  Canvas,
  DEFAULT_BOX_SIZE,
  generateBoxPositions,
  transformToContainBoxes,
  calculateBoundingBox,
  getViewCenter,
  Box
} from '@nodenogg.in/spatial-view'
import { State } from '@nodenogg.in/state'
import { NiceMap } from '@nodenogg.in/utils'
import { Instance } from '../app'
import { EditableMicrocosmAPI, MicrocosmAPI } from './api'

export type MicrocosmAPIConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
}

export interface View {
  id: string
  dispose: () => void
}

export type MicrocosmAPIEvents = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  collections: string[]
  active: boolean
}

export class BaseMicrocosmAPI extends State<MicrocosmAPIEvents> {
  public readonly microcosm_uri: string
  protected readonly views = new NiceMap<string, Canvas>()
  protected password?: string
  protected readonly user_id: string

  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor({ microcosm_uri, user_id, password }: MicrocosmAPIConfig) {
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

  public canvas = (id: string) => {
    const view = this.views.getOrSet(id, () => this.createCanvas(id))
    return view
  }

  public onDropFiles = async (canvas: Canvas<this>, files: File[]) => {
    if (this.isEditable()) {
      const converted = await new Importer().importFiles(files)
      console.log(converted)

      const htmlNodes = converted.filter((n) => isParsedNodeType(n, 'html')) as ParsedNode<'html'>[]

      const origin = getViewCenter(canvas.interaction.get())

      const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

      console.log(htmlNodes)
      const nodes = htmlNodes.map((node, i) => ({
        ...node,
        ...positions[i]
      }))

      // console.log(nodes)
      const bx = calculateBoundingBox(nodes)
      console.log(bx)
      // console.log(bx)
      canvas.interaction.centerAndZoomOnBox(bx)
      // console.log('boxes')
      // console.log(nodes)
      // console.log('bounds')
      // console.log(bx)
      // view.interaction.centerViewAroundBox(bx)
      this.create(nodes)
    }
  }

  private createCanvas = (id: string) => {
    const timer = Instance.telemetry.time({
      name: 'Microcosm',
      message: `Created view for ${id} in ${this.microcosm_uri}`,
      level: 'info'
    })

    const canvas = new Canvas(this, id, Instance.getPersistenceName(['Microcosm', 'spatial', id]))

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

  public isEditable = (): this is EditableMicrocosmAPI => 'leave' in this
}

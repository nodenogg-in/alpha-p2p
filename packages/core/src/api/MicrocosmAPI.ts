import { type ParsedNode, isParsedNodeType, Importer } from '@nodenogg.in/parsers'
import type {
  IdentityWithStatus,
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
  generateBoxPositions,
  transformToContainBoxes,
  calculateBoundingBox,
  getViewCenter,
  Box
} from '@nodenogg.in/spatial-view'
import { PersistenceName, Signal, State } from '@nodenogg.in/state'
import { NiceMap } from '@nodenogg.in/utils'
import { Instance } from '..'
import type { EditableMicrocosmAPI } from './api'
import type { View, ViewFactory } from '..'

export type MicrocosmAPIConfig = {
  microcosm_uri: string
  view?: ViewType
  user_id: string
  password?: string
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

export class MicrocosmAPI extends State<MicrocosmAPIEvents> {
  public readonly microcosm_uri: string
  protected readonly views = new NiceMap<string, View>()
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
        this.key('status').on(({ connected }) => {
          if (connected) this.join()
        }),
        Instance.session.key('active').on((active) => {})
      )
    }
  }

  public node: <T extends NodeType>(node_id: string, type?: T) => Node<T> | undefined

  public nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]

  public getCollections: () => string[]

  public subscribeToCollection: (user_id: string) => Signal<NodeReference[]>

  public getCollection: (user_id: string) => NodeReference[]

  public boxes: () => BoxReference[]

  public isActive = () => Instance.session.isActive(this.microcosm_uri)

  public registerView = <V extends View>(
    id: string,
    makeView: ViewFactory<this, V>,
    persist?: PersistenceName
  ) => this.views.getOrSet(id, () => makeView({ api: this, id, persist })) as V

  public onDropFiles = async (view: View, files: File[]) => {
    if (this.isEditable() && view instanceof Canvas) {
      const converted = await new Importer().importFiles(files)

      const htmlNodes = converted.filter((n) => isParsedNodeType(n, 'html')) as ParsedNode<'html'>[]

      const origin = getViewCenter(view.interaction.get())

      const positions = generateBoxPositions(origin, DEFAULT_BOX_SIZE, htmlNodes)

      const nodes = htmlNodes.map((node, i) => ({
        ...node,
        ...positions[i]
      }))

      // console.log(nodes)
      const bx = calculateBoundingBox(nodes)
      // console.log(bx)
      view.interaction.centerAndZoomOnBox(bx)
      // console.log('boxes')
      // console.log(nodes)
      // console.log('bounds')
      // console.log(bx)
      // view.interaction.centerViewAroundBox(bx)
      this.create(nodes)
    }
  }

  public isEditable = (): this is EditableMicrocosmAPI => 'leave' in this
}

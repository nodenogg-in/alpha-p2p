import type {
  IdentityWithStatus,
  Identity_ID,
  Node,
  NodeReference,
  NodeType,
  Node_ID
} from '@nodenogg.in/schema'
import { type BoxReference } from '@nodenogg.in/spatialkit'
import { type Signal, State } from '@nodenogg.in/smallstate'
import { Instance } from '..'
import { isEditableAPI } from './api'

export type MicrocosmAPIConfig = {
  microcosm_uri: string
  view?: string
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

    this.use(
      Instance.session.user.on(() => {
        if (isEditableAPI(this)) {
          this.join()
        }
      }),
      Instance.ui.keyboard.onCommand({
        redo: () => {
          console.log('want to redo')
          if (this.isActive() && isEditableAPI(this)) {
            console.log('attempting redo')
            this.redo()
            console.log('done redo')
          }
        },
        undo: () => {
          console.log('want to undo')
          if (this.isActive() && isEditableAPI(this)) {
            console.log('attempting undo')
            this.undo()
            console.log('done undo')
          }
        }
      })
    )

    if (isEditableAPI(this)) {
      this.use(
        this.key('status').on(({ connected }) => {
          if (connected) this.join()
        }),
        Instance.session.key('active').on(() => {})
      )
    }
  }

  public node: <T extends NodeType>(node_id: Node_ID, type?: T) => Node<T> | undefined

  public nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]

  public getCollections: () => Identity_ID[]

  public subscribeToCollection: (user_id: Identity_ID) => Signal<NodeReference[]>

  public getCollection: (user_id: Identity_ID) => NodeReference[]

  public boxes: () => BoxReference[]

  public isActive = () => Instance.session.isActive(this.microcosm_uri)
}

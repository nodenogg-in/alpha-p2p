import { type Signal, State } from '@nodenogg.in/statekit'
import type { Telemetry } from '@nodenogg.in/framework'
import type {
  IdentityWithStatus,
  Identity_UID,
  Microcosm_URI,
  Node,
  NodeReference,
  NodeType,
  Node_ID
} from '.'

export type MicrocosmAPIConfig = {
  microcosm_uri: Microcosm_URI
  identity_uid: Identity_UID
  view?: string
  password?: string
}

export type MicrocosmAPIEvents = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  collections: Identity_UID[]
  active: boolean
}

export class MicrocosmAPI extends State<MicrocosmAPIEvents> {
  public readonly microcosm_uri: Microcosm_URI
  protected password?: string
  protected readonly identity_uid: Identity_UID

  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    { microcosm_uri, identity_uid, password }: MicrocosmAPIConfig,
    protected telemetry?: Telemetry
  ) {
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
    this.identity_uid = identity_uid
    this.microcosm_uri = microcosm_uri
  }

  public node: <T extends NodeType>(node_id: Node_ID, type?: T) => Node<T> | undefined

  public nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]

  public getCollections: () => Identity_UID[]

  public subscribeToCollection: (identity_uid: Identity_UID) => Signal<NodeReference[]>

  public getCollection: (identity_uid: Identity_UID) => NodeReference[]

  public isActive: () => boolean

  public boxes: () => NodeReference<'html'>[]
}

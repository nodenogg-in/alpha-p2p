import { type Signal, State } from '@nodenogg.in/statekit'
import type { Telemetry } from '@nodenogg.in/framework'
import type {
  IdentityWithStatus,
  IdentityID,
  MicrocosmID,
  Node,
  NodeReference,
  NodeType,
  NodeID
} from '.'

export type MicrocosmAPIConfig = {
  MicrocosmID: MicrocosmID
  IdentityID: IdentityID
  view?: string
  password?: string
}

export type MicrocosmAPIEvents = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  collections: IdentityID[]
  active: boolean
}

export class MicrocosmAPI extends State<MicrocosmAPIEvents> {
  public readonly MicrocosmID: MicrocosmID
  protected password?: string
  protected readonly IdentityID: IdentityID

  /**
   * Creates a new Microcosm
   */
  constructor(
    { MicrocosmID, IdentityID, password }: MicrocosmAPIConfig,
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
    this.IdentityID = IdentityID
    this.MicrocosmID = MicrocosmID
  }

  /**
   * Retrieves a single {@link Node} by {@link NodeID} and optional type
   * @param IdentityID
   * @param NodeType
   * @returns a {@link Node} or undefined
   */
  public node: <T extends NodeType>(NodeID: NodeID, type?: T) => Node<T> | undefined

  public nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]

  public getCollections: () => IdentityID[]

  public subscribeToCollection: (IdentityID: IdentityID) => Signal<NodeReference[]>

  /**
   * Gets a snapshot of Nodes in a collection
   * @param IdentityID
   * @returns array of {@link Node}s
   */
  public getCollection: (IdentityID: IdentityID) => NodeReference[]

  public isActive: () => boolean

  /**
   * Get a list of positioned HTML boxes within the current Microcosm
   * @returns a list of boxes
   */
  public boxes: () => NodeReference<'html'>[]
}

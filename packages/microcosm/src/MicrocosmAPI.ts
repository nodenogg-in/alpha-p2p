import { type Signal, State } from '@figureland/statekit'
import type {
  IdentityWithStatus,
  IdentityID,
  MicrocosmID,
  Node,
  NodeReference,
  NodeType,
  NodeID
} from '.'
import type { BaseTelemetry } from './api'

export type MicrocosmAPIConfig = {
  microcosmID: MicrocosmID
  identityID: IdentityID
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

/**
 * Creates an instance of the **MicrocosmAPI** class. This permits
 * read operations on the Microcosm.
 * @example
 * ```ts
 * const example = new MicrocosmAPI({
 *    microcosmID: 'example-microcosm.uuid',
 *    identityID: 'identity_example'
 * })
 * ```
 */
export abstract class MicrocosmAPI<
  T extends BaseTelemetry = BaseTelemetry
> extends State<MicrocosmAPIEvents> {
  public readonly microcosmID: MicrocosmID
  protected readonly identityID: IdentityID
  protected password?: string

  /**
   * Creates a new Microcosm
   */
  constructor(
    { microcosmID, identityID, password }: MicrocosmAPIConfig,
    protected telemetry?: T
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
    this.identityID = identityID
    this.microcosmID = microcosmID
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

  public subscribeToCollection: (identity: IdentityID) => Signal<NodeReference[]>

  /**
   * Gets a snapshot of Nodes in a collection
   * @param identityID
   * @returns array of {@link Node}s
   */
  public getCollection: (identityID: IdentityID) => NodeReference[]

  public isActive: () => boolean

  /**
   * Get a list of positioned HTML boxes within the current Microcosm
   * @returns a list of boxes
   */
  public boxes: () => NodeReference<'html'>[]
}

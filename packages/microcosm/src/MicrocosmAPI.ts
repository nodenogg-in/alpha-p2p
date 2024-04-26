import { type Signal, manager, signalObject, type Disposable } from '@figureland/statekit'
import type { IdentityID, MicrocosmID, Node, NodeType, NodeID } from '.'
import type { Telemetry } from './telemetry'
import { IdentityWithStatus } from './schema/identity.schema'

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

export type MicrocosmAPIState = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
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
export abstract class MicrocosmAPI<T extends Telemetry = Telemetry> implements Disposable {
  public readonly microcosmID: MicrocosmID
  protected readonly identityID: IdentityID
  protected password?: string
  manager = manager()

  state = this.manager.use(
    signalObject<MicrocosmAPIState>({
      status: {
        connected: false,
        ready: false
      },
      identities: [],
      active: false
    })
  )
  /**
   * Creates a new Microcosm
   */
  constructor(
    { microcosmID, identityID, password }: MicrocosmAPIConfig,
    protected telemetry?: T
  ) {
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
  // public node: <T extends NodeType>(NodeID: NodeID, type?: T) => Node<T> | undefined

  public nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? Node[] : never) | Node<NonNullable<T>>[]

  public collections: () => Signal<IdentityID[]>

  public collection: (identity: IdentityID) => Signal<NodeID[]>

  public node: <T extends NodeType = NodeType>(
    identityID: IdentityID,
    nodeID: NodeID,
    type?: T
  ) => Signal<Node<T> | undefined>

  public isActive: () => boolean

  public dispose: () => void
}

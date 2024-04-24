import { signal, type Signal, manager } from '@figureland/statekit'
import { isArray } from '@figureland/typekit'
import {
  type NodeUpdate,
  type Node,
  type NodeType,
  type IdentityID,
  type NewNode,
  type NodeID,
  isValidIdentityID,
  isValidNodeID,
  updateNode,
  isNodeType,
  createNode
} from '@nodenogg.in/microcosm'
import { Doc, UndoManager, Map as YMap } from 'yjs'

const isYMap = (value: any): value is YMap<any> => value instanceof YMap

const getCollectionNodeIDs = (collection?: YMap<Node>): NodeID[] =>
  collection && isYMap(collection) ? Array.from(collection.keys() || []).filter(isValidNodeID) : []

const getCollectionKeys = (collections: YMap<any>): IdentityID[] =>
  Array.from(collections.keys()).filter(isValidIdentityID)

export class YMicDoc extends Doc {
  private current_identity_id!: IdentityID
  private undoManager: UndoManager
  private manager = manager()

  private identitiesMap: YMap<boolean>
  private identityNodesMap: YMap<Node>
  public collections: Signal<IdentityID[]>

  constructor() {
    super()
    this.identitiesMap = this.getMap<boolean>('collections')

    this.collections = this.manager.use(signal(() => getCollectionKeys(this.identitiesMap)))
    const load = () => {
      this.collections.set(getCollectionKeys(this.identitiesMap))
    }

    this.identitiesMap.observe(load)
    this.manager.use(() => this.identitiesMap.unobserve(load))
    this.manager.use(this.destroy)
    this.manager.use(this.undoManager.destroy)
  }

  /**
   * Initialize the document with a new identity_id
   *
   * @param identity_id
   */
  public init = (identity_id: IdentityID) => {
    if (this.current_identity_id !== identity_id) {
      this.identityNodesMap = this.get(identity_id, YMap<Node>)
      this.undoManager = new UndoManager(this.identityNodesMap)
      this.identitiesMap.set(identity_id, true)
    }
  }

  private getCollection = (identity_id: IdentityID) => this.get(identity_id, YMap<Node>)

  /**
   * Returns a Signal containing a collection of {@link NodeID}s
   *
   * @param identity_id
   * @returns {@link Signal<NodeID[]>}
   */
  public collection = (identity_id: IdentityID): Signal<NodeID[]> => {
    const target = this.getCollection(identity_id)
    const value = this.manager.unique(identity_id, () => signal(() => getCollectionNodeIDs(target)))

    const load = () => {
      value.set(getCollectionNodeIDs(target))
    }
    target.observe(load)
    value.use(() => target.unobserve(load))
    return value
  }

  /**
   * Get a Signal containing a single {@link Node} or undefined if it doesn't exist
   *
   * @param identity_id
   * @param node_id
   * @returns {@link Signal<NodeID[]>}
   */
  public node = <T extends NodeType>(
    identity_id: IdentityID,
    node_id: NodeID,
    type?: T
  ): Signal<Node<T> | undefined> => {
    const target = this.getCollection(identity_id)
    const getNode = (): Node<T> | undefined => {
      const result = target?.get(node_id)
      if (type) {
        return isNodeType(target, type) ? (target as Node<T>) : undefined
      }
      return result as Node<T> | undefined
    }

    const value = this.manager.unique(`${identity_id}${node_id}`, () =>
      signal<Node<T> | undefined>(getNode, {
        equality: (a, b) => a?.lastEdited === b?.lastEdited
      })
    )

    if (target) {
      target?.observe(getNode)
      value.use(() => target?.unobserve(getNode))
    }
    return value
  }

  /**
   * Updates a single {@link Node}
   */
  public update = <T extends NodeType>(node_id: NodeID, update: NodeUpdate<T>) => {
    const collection = this.identityNodesMap
    if (collection) {
      const target = collection.get(node_id) as Node<T> | undefined
      if (target) {
        collection.set(node_id, updateNode<T>(target, update))
      }
    }
  }

  public create = (newNode: NewNode): NodeID => {
    const collection = this.identityNodesMap
    const [id, node] = createNode(newNode)
    collection.set(id, node)
    return id
  }

  public delete = (node_id: NodeID) => {
    this.identityNodesMap?.delete(node_id)
  }

  public undo = () => {
    this.undoManager?.undo()
  }

  public redo = () => {
    this.undoManager?.redo()
  }

  public dispose = () => this.manager.dispose()
}

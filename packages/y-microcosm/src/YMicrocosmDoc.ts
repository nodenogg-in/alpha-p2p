import {
  signal,
  type Signal,
  type Unsubscribe,
  manager,
  type Disposable
} from '@figureland/statekit'
import { isValidIdentityID, isValidNodeID } from '@nodenogg.in/microcosm'
import {
  type NodeUpdate,
  type Node,
  type NodeType,
  type IdentityID,
  type NodeID
} from '@nodenogg.in/microcosm'
import { Doc, UndoManager, Map as YMap } from 'yjs'

const isYMap = (value: any): value is YMap<any> => value instanceof YMap

const getCollectionNodeIDs = (collection?: YMap<Node>): NodeID[] =>
  collection && isYMap(collection) ? Array.from(collection.keys() || []).filter(isValidNodeID) : []

const getCollectionKeys = (collections: YMap<any>): IdentityID[] =>
  Array.from(collections.keys()).filter(isValidIdentityID)

export const createYMicrocosmDoc = (current_identity_id: IdentityID): YMicDoc => {
  const { use, dispose } = manager()
  const doc = new Doc()
  const collections: YMap<boolean> = doc.getMap<boolean>('collections')
  const collection: YMap<Node> = doc.get(current_identity_id, YMap<Node>)
  const undoManager: UndoManager = new UndoManager(collection)

  collections.set(current_identity_id, true)

  const getCollection = (identity_id: IdentityID) => doc.get(identity_id, YMap<Node>)

  return {
    collections: (): Signal<IdentityID[]> => {
      const value = use(signal(() => getCollectionKeys(collections)))
      const load = () => {
        value.set(getCollectionKeys(collections))
      }
      collections.observe(load)
      value.use(() => collections.unobserve(load))
      return value
    },
    collection: (identity_id: IdentityID): Signal<NodeID[]> => {
      const target = getCollection(identity_id)
      const value = use(signal(() => getCollectionNodeIDs(target)))

      const load = () => {
        value.set(getCollectionNodeIDs(doc.get(identity_id, YMap<Node>)))
      }
      target.observe(load)
      value.use(() => target.unobserve(load))
      return value
    },
    node: (identity_id: IdentityID, node_id: NodeID): Signal<Node | undefined> => {
      const target = getCollection(identity_id)
      const getNode = () => target?.get(node_id)

      const value = use(signal(getNode))
      if (target) {
        target?.observe(getNode)
        value.use(() => target?.unobserve(getNode))
      }
      return value
    },
    undo: () => {
      undoManager.undo()
    },
    redo: () => {
      undoManager.redo()
    },
    dispose
  }
}

export type YMicDoc = Disposable & {
  collections: () => Signal<IdentityID[]>
  collection: (identity_id: IdentityID) => Signal<NodeID[]>
  node: (identity_id: IdentityID, node_id: NodeID) => Signal<Node | undefined>
  undo: () => void
  redo: () => void
}

export class YMicrocosmDoc extends Doc {
  private collections!: YMap<boolean>
  public collection!: YMap<Node>
  private cached!: Node[]
  private undoManager!: UndoManager

  public init = (identityID: IdentityID): YMicrocosmDoc => {
    this.collection = this.getCollection(identityID)
    this.collections = this.getMap<boolean>('collections')
    this.collections.set(identityID, true)

    this.subscribeAll(this.getAllNodes)
    this.undoManager = new UndoManager(this.collection)
    return this
  }

  private getCollection = (identityId: IdentityID) => this.get(identityId, YMap<Node>)

  public getCollections = (): IdentityID[] => Array.from(this.collections.keys()) as IdentityID[]

  public collectionToNodes = (id: IdentityID): NodeReference[] =>
    this.getCollection(id)
      ? Array.from(this.getCollection(id).entries()).filter(isNodeReference)
      : []

  /**
   * Updates a single {@link Node}
   */
  public update = async <T extends NodeType>(id: NodeID, update: NodeUpdate<T>) => {
    const target = this.collection.get(id)
    if (target) {
      this.collection.set(id, await updateNode<T>(target as Node<T>, update))
    }
  }

  public patch = <T extends NodeType>(id: NodeID, patch: NodePatch<T>) => {
    const target = this.collection.get(id)
    if (target) {
      this.update(id, patch(target as Node<T>))
    }
  }

  /**
   * Retrieves and caches all {@link Node}s in the {@link Microcosm}
   */
  private getAllNodes = (): Node[] => {
    this.cached = this.getCollections().map(this.collectionToNodes).flat(1)
    return this.cached
  }

  /**
   * The latest snapshot of all {@link Node}s in the {@link Microcosm}
   */
  public nodes = (): Node[] => this.cached || this.getAllNodes()

  /**
   * Subscribes to a list of all {@link Node}s in the {@link Microcosm}
   */
  public subscribeAll = (fn: (data: NodeReference[]) => void): Unsubscribe => {
    const listener = () => {
      fn(this.getAllNodes())
    }
    this.on('update', listener)
    listener()
    return () => this.off('update', listener)
  }

  /**
   * Subscribes to a list of ids of collections of {@link Node}s
   */
  public subscribeToCollections = (): Signal<IdentityID[]> => {
    const load = () => Array.from(this.collections.keys()) as IdentityID[]
    const result = signal(load)
    this.collections.observe(() => {
      result.set(load())
    })
    return result
  }

  /**
   * Subscribes to a user's collection of {@link Node}s
   */
  public subscribeToCollection = (
    identityID: IdentityID,
    fn: (nodes: [NodeID, Node][]) => void
  ): Unsubscribe => {
    const target = this.getCollection(identityID)
    let listener: Unsubscribe
    if (target) {
      listener = () => {
        fn(this.collectionToNodes(identityID))
      }

      target.observeDeep(listener)
      listener()
    }

    return () => {
      if (listener) target?.unobserveDeep(listener)
    }
  }

  public dispose = () => {
    this.destroy()
    this.undoManager.destroy()
  }

  /**
   * Undoes the previous action within this user's list of {@link Node}s (uses {@link UndoManager})
   */
  public undo = () => {
    this.undoManager.undo()
  }

  /**
   * Redoes the previous action within this user's list of {@link Node}s (uses {@link UndoManager})
   */
  public redo = () => {
    this.undoManager.redo()
  }
}

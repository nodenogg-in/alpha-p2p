import { signal, type Signal, type Unsubscribe } from '@nodenogg.in/statekit'
import {
  updateNode,
  type NodePatch,
  type NodeUpdate,
  type Node,
  type NodeReference,
  type NodeType,
  isNodeReference,
  Node_ID,
  Identity_UID
} from '@nodenogg.in/microcosm'
import { Doc, UndoManager, Map as YMap } from 'yjs'

export class YMicrocosmDoc extends Doc {
  private collections!: YMap<boolean>
  public collection!: YMap<Node>
  private cached!: NodeReference[]
  private undoManager!: UndoManager

  public init = (identity_uid: Identity_UID): YMicrocosmDoc => {
    this.collection = this.getCollection(identity_uid)
    this.collections = this.getMap<boolean>('collections')
    this.collections.set(identity_uid, true)

    this.subscribeAll(this.getAllNodes)
    this.undoManager = new UndoManager(this.collection)
    return this
  }

  private getCollection = (name: Identity_UID) => this.get(name, YMap<Node>)

  public getCollections = (): Identity_UID[] => Array.from(this.collections.keys()) as Identity_UID[]

  public collectionToNodes = (identity_uid: Identity_UID): NodeReference[] =>
    this.getCollection(identity_uid)
      ? Array.from(this.getCollection(identity_uid).entries()).filter(isNodeReference)
      : []

  /**
   * Updates a single {@link Node}
   */
  public update = async <T extends NodeType>(node_id: Node_ID, update: NodeUpdate<T>) => {
    const target = this.collection.get(node_id)
    if (target) {
      this.collection.set(node_id, await updateNode<T>(target as Node<T>, update))
    }
  }

  public patch = <T extends NodeType>(node_id: Node_ID, patch: NodePatch<T>) => {
    const target = this.collection.get(node_id)
    if (target) {
      this.update(node_id, patch(target as Node<T>))
    }
  }

  /**
   * Retrieves and caches all {@link Node}s in the {@link Microcosm}
   */
  private getAllNodes = (): NodeReference[] => {
    this.cached = this.getCollections().map(this.collectionToNodes).flat(1)
    return this.cached
  }

  /**
   * The latest snapshot of all {@link Node}s in the {@link Microcosm}
   */
  public nodes = (): NodeReference[] => this.cached || this.getAllNodes()

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
  public subscribeToCollections = (): Signal<Identity_UID[]> => {
    const load = () => Array.from(this.collections.keys()) as Identity_UID[]
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
    identity_uid: Identity_UID,
    fn: (nodes: [Node_ID, Node][]) => void
  ): Unsubscribe => {
    const target = this.getCollection(identity_uid)
    let listener: Unsubscribe
    if (target) {
      listener = () => {
        fn(this.collectionToNodes(identity_uid))
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

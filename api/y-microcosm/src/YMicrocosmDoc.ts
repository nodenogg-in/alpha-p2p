import { signal, type Signal, type Unsubscribe } from '@nodenogg.in/statekit'
import {
  type NodePatch,
  type NodeUpdate,
  type Node,
  type NodeReference,
  type NodeType,
  type IdentityID,
  type NodeID,
  isNodeReference,
  updateNode
} from '@nodenogg.in/microcosm'
import { Doc, UndoManager, Map as YMap } from 'yjs'

export class YMicrocosmDoc extends Doc {
  private collections!: YMap<boolean>
  public collection!: YMap<Node>
  private cached!: NodeReference[]
  private undoManager!: UndoManager

  public init = (identityID: IdentityID): YMicrocosmDoc => {
    this.collection = this.getCollection(identityID)
    this.collections = this.getMap<boolean>('collections')
    this.collections.set(identityID, true)

    this.subscribeAll(this.getAllNodes)
    this.undoManager = new UndoManager(this.collection)
    return this
  }

  private getCollection = (name: IdentityID) => this.get(name, YMap<Node>)

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

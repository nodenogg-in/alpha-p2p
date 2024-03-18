import { updateNode, type NodePatch, type NodeUpdate } from '@nodenogg.in/core'
import type { Unsubscribe } from '@nodenogg.in/state'
import { type Node, type NodeReference, type NodeType, isNodeReference } from '@nodenogg.in/schema'
import { Doc, UndoManager, Map as YMap } from 'yjs'

export class YMicrocosmDoc extends Doc {
  private collections!: YMap<boolean>
  public collection!: YMap<Node>
  private cached!: NodeReference[]
  private undoManager!: UndoManager

  public init = (user_id: string): YMicrocosmDoc => {
    this.collection = this.getCollection(user_id)
    this.collections = this.getMap<boolean>('collections')
    this.collections.set(user_id, true)

    this.subscribeAll(this.getAllNodes)
    this.undoManager = new UndoManager(this.collection)
    return this
  }

  private getCollection = (name: string) => this.get(name, YMap<Node>)

  public getCollections = (): string[] => Array.from(this.collections.keys())

  public collectionToNodes = (user_id: string): NodeReference[] =>
    this.getCollection(user_id)
      ? Array.from(this.getCollection(user_id).entries()).filter(isNodeReference)
      : []

  /**
   * Updates a single {@link Node}
   */
  public update = async <T extends NodeType>(node_id: string, update: NodeUpdate<T>) => {
    const target = this.collection.get(node_id)
    if (target) {
      this.collection.set(node_id, await updateNode<T>(target as Node<T>, update))
    }
  }

  public patch = <T extends NodeType>(node_id: string, patch: NodePatch<T>) => {
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
  public subscribeToCollections = (fn: (data: string[]) => void): Unsubscribe => {
    const listener = () => {
      fn(Array.from(this.collections.keys()))
    }
    this.collections.observe(() => {
      console.log('event')
      listener()
    })
    listener()
    return () => {
      this.collections.unobserve(listener)
    }
  }

  /**
   * Subscribes to a user's collection of {@link Node}s
   */
  public subscribeToCollection = (
    user_id: string,
    fn: (nodes: [string, Node][]) => void
  ): Unsubscribe => {
    const target = this.getCollection(user_id)
    let listener: Unsubscribe
    if (target) {
      listener = () => {
        fn(this.collectionToNodes(user_id))
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

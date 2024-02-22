import { Doc, UndoManager, Map as YMap } from 'yjs'
import { is } from 'valibot'

import { type Node, NodeReference, nodeSchema, NewNode } from '../../schema'
import type { Unsubscribe } from '../../utils/emitter/Emitter'
import { createUuid, isArray, sanitizeHTML } from '../../utils'
import { type NodeUpdate, isNodeUpdate, updateNode, createNode } from '../utils'
import { isHTMLNode } from '../guards'

export class YMicrocosmDoc extends Doc {
  private collections: YMap<boolean>
  public collection: YMap<Node>
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

  private getCollections = (): string[] => Array.from(this.collections.keys())

  private sanitizeNode = (ref: NodeReference): NodeReference => {
    if (isHTMLNode(ref[1])) {
      return [ref[0], { ...ref[1], content: sanitizeHTML(ref[1].content) }]
    } else {
      return ref
    }
  }

  private collectionToNodes = (user_id?: string): NodeReference[] =>
    user_id ? Array.from(this.getCollection(user_id).entries()).map(this.sanitizeNode) : []

  /**
   * Updates one or more {@link Node}s
   */
  public update = (...u: NodeUpdate | NodeUpdate[]) =>
    this.transact(() => {
      if (isNodeUpdate(u)) {
        this.updateNode(u)
      } else {
        for (const update of u) {
          this.updateNode(update as NodeUpdate)
        }
      }
    })

  /**
   * Updates a single {@link Node}
   */
  private updateNode = ([node_id, update]: NodeUpdate) => {
    const target = this.collection.get(node_id)
    if (target && update.type === target.type) {
      this.collection.set(node_id, updateNode(target, update))
    }
  }

  /**
   * Creates a new {@link Node}
   */
  private createNode = (newNode: NewNode) => {
    try {
      const node = createNode(newNode)
      if (is(nodeSchema, node)) {
        const id = createUuid()
        this.collection.set(id, node)
        return id
      } else {
        throw new Error()
      }
    } catch (e) {
      throw e || new Error(`${newNode} is not a valid node type`)
    }
  }

  /**
   * Creates one of the user's {@link Node}s
   */
  private deleteNode = (node_id: string): void => {
    this.collection.delete(node_id)
  }

  /**
   * Creates a new {@link Node}
   */
  public create = (n: NewNode | NewNode[]): string | string[] =>
    this.transact(() => {
      if (isArray(n)) {
        return n.map(this.createNode)
      } else {
        return this.createNode(n)
      }
    })

  /**
   * Deletes a {@link Node}
   */
  public delete = (node_id: string | string[]) => {
    this.transact(() => {
      if (isArray(node_id)) {
        for (const n of node_id) {
          this.deleteNode(n)
        }
      } else {
        this.deleteNode(node_id)
      }
    })
  }

  /**
   * Deletes all the user's {@link Node}s.
   */
  public deleteAll = () => {
    for (const [n] of this.collection.entries()) {
      this.delete(n)
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
    Array.from(this.collections.keys())
    const listener = () => {
      fn(Array.from(this.collections.keys()))
    }
    this.collections.observe(listener)
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
    let listener: () => void
    if (target) {
      listener = () => {
        fn(this.collectionToNodes(user_id))
      }

      target.observe(listener)
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

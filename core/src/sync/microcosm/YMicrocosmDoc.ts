import { deepmerge } from 'deepmerge-ts'
import { partial, is, parse } from 'valibot'
import { Doc, UndoManager, Map as YMap } from 'yjs'

import { type HTMLNode, type Node, htmlNodeSchema } from '../schema'
import type { Unsubscribe } from '../../utils/emitter/Emitter'
import { createUuid, isArray, sanitizeHTML } from '../../utils'
import type { NodeReference } from './Microcosm'

type YCollection = YMap<HTMLNode>

type NodeUpdate = [string, Partial<Node>]

const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export class YMicrocosmDoc extends Doc {
  private collections: YMap<boolean>
  public collection: YCollection
  private cached!: NodeReference[]
  private undoManager!: UndoManager

  constructor(user_id: string) {
    super()
    this.collection = this.getCollection(user_id)
    this.collections = this.getMap<boolean>('collections')
    this.collections.set(user_id, true)
    this.undoManager = new UndoManager(this.collection)
  }

  private getCollection = (name: string) => this.get(name, YMap<HTMLNode>)

  private getCollections = (): string[] => Array.from(this.collections.keys())

  private sanitizeNode = ([id, node]: NodeReference): NodeReference => [
    id,
    {
      ...node,
      content: sanitizeHTML(node.content)
    }
  ]

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
    if (target && is(partial(htmlNodeSchema), update) && target.type === update.type) {
      const newNode = deepmerge(target, update)
      this.collection.set(node_id, newNode)
    }
  }

  /**
   * Creates a new {@link Node}
   */
  private createNode = (newNode: Node) => {
    try {
      parse(htmlNodeSchema, newNode)
      const id = createUuid()
      this.collection.set(id, newNode)
      return id
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
  public create = (n: Node | Node[]): string | string[] =>
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
    fn: (nodes: [string, HTMLNode][]) => void
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

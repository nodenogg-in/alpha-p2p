import { calculateBoundingBox, intersects } from '@figureland/mathkit/box'
import type { Box, Vector2 } from '@figureland/mathkit'
import { createEvents, type Disposable } from '@figureland/statekit'

export type QueryResult<T extends Box> = {
  items: T[]
  boundingBox: Box
}

type Query<T extends Box> = {
  id: string
  target: Vector2 | Box
  resolvers: Array<(result: QueryResult<T>) => void>
}

type QueryEvents<T extends Box> = {
  queryAdded: string
  queryProcessed: [string, QueryResult<T>]
  processingStarted: void
  processingFinished: void
}

export class CanvasObjects<ID extends string, T extends Box> implements Disposable {
  private entityMap: Map<ID, T> = new Map()
  private queryQueue: Map<string, Query<T>> = new Map()
  private isProcessing: boolean = false
  public readonly events = createEvents<QueryEvents<T>>()

  public add = (id: ID, item: T) => {
    this.entityMap.set(id, item)
  }

  public update = (location: ID, item: T) => {
    this.entityMap.set(location, item)
  }

  public delete = (location: ID) => {
    this.entityMap.delete(location)
  }

  public query = (id: string, target: Box | Vector2, timeout?: number): Promise<QueryResult<T>> => {
    return new Promise((resolve, reject) => {
      const existingQuery = this.queryQueue.get(id)

      if (existingQuery) {
        existingQuery.resolvers.push(resolve)
      } else {
        this.queryQueue.set(id, {
          id,
          target,
          resolvers: [resolve]
        })
      }

      if (timeout) {
        setTimeout(() => {
          const query = this.queryQueue.get(id)
          if (query) {
            this.queryQueue.delete(id)
            reject(new Error(`Query with ID ${id} timed out`))
            // Clean up resolvers that didn't resolve within the timeout
            query.resolvers.forEach((resolver) =>
              resolver({ items: [], boundingBox: { x: 0, y: 0, width: 0, height: 0 } })
            )
          }
        }, timeout)
      }

      this.events.emit('queryAdded', id)

      if (!this.isProcessing) {
        this.processQueries()
      }
    })
  }

  private processQueries = async () => {
    this.isProcessing = true
    this.events.emit('processingStarted', undefined)

    while (this.queryQueue.size > 0) {
      const queries = Array.from(this.queryQueue.values())
      this.queryQueue.clear()
      const items: T[] = []

      for (const entity of this.entityMap.values()) {
        for (const query of queries) {
          if (intersects(entity, query.target)) {
            items.push(entity)
            break // No need to check further queries for this entity
          }
        }
      }

      const result = {
        items,
        boundingBox: calculateBoundingBox(items)
      }

      for (const query of queries) {
        for (const resolve of query.resolvers) {
          resolve(result)
        }
        this.queryQueue.delete(query.id) // Clean up the query
        this.events.emit('queryProcessed', [query.id, result])
      }
    }

    this.isProcessing = false
    this.events.emit('processingFinished', undefined)
  }

  public dispose = () => {
    this.events.dispose()
    this.entityMap.clear()
    this.queryQueue.clear()
  }
}

export default CanvasObjects

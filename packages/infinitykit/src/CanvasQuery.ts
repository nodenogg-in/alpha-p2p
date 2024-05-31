import type { Vector2 } from '@figureland/mathkit/vector2'
import { calculateBoundingBox, intersects, isBox, type Box } from '@figureland/mathkit/box'
import {
  Signal,
  UseSignalDependency,
  createEvents,
  effect,
  signal,
  system,
  type Disposable
} from '@figureland/statekit'
import { isNotNullish } from '@figureland/typekit/guards'
import { arraysEquals } from '@figureland/typekit/equals'

export type QueryIdentifier = `query/${string | number}` | symbol

export type Query<ID extends string, Item> = {
  queryID: QueryIdentifier
  params: CanvasQueryParams<ID, Item>
  result: ID[]
  resolve: ((result: ID[]) => void) | null
}

export type CanvasQueryParams<ID extends string, Item> = {
  target?: Box | Vector2
  filter?: (item: Item) => boolean
  ids?: ID[]
}

export class CanvasQuery<ID extends string, Item> implements Disposable {
  private readonly system = system()
  private readonly entityMap: Map<ID, Item> = new Map()
  private readonly queryQueue: Map<QueryIdentifier, Query<ID, Item>> = new Map()
  public readonly data = this.system.use(createEvents<Record<ID, Item>>())
  public ids = this.system.use(
    signal<ID[]>(() => [], {
      equality: arraysEquals
    })
  )

  private isProcessing: boolean = false
  public readonly events = createEvents<
    {
      queryAdded: QueryIdentifier
      processingStarted: void
      processingFinished: void
    } & Record<QueryIdentifier, ID[]>
  >()

  constructor() {
    this.data.all(() => this.ids.set(Array.from(this.entityMap.keys())))
  }

  public add = (id: ID, item: Item): void => {
    this.entityMap.set(id, item)
    this.data.emit(id, item)
  }

  public update = (id: ID, item: Item): void => {
    this.entityMap.set(id, item)
    this.data.emit(id, item)
  }

  public delete = (id: ID): void => {
    const previous = this.entityMap.get(id)
    if (previous) {
      this.entityMap.delete(id)
      this.data.emit(id, previous)
    }
  }

  public get = (id: ID): Item | undefined => this.entityMap.get(id)

  public subscribe = (id: ID) =>
    this.system.unique(id, () => {
      const s = signal(() => this.entityMap.get(id))
      this.data.on(id, s.set)
      return s
    })

  public on = this.events.on

  public search = (
    queryID: QueryIdentifier,
    params: CanvasQueryParams<ID, Item> = {}
  ): Promise<ID[]> =>
    new Promise((resolve) => {
      const existingQuery = this.queryQueue.get(queryID)

      if (existingQuery) {
        existingQuery.resolve = resolve
        existingQuery.params = params
        existingQuery.result = []
      } else {
        this.queryQueue.set(queryID, {
          queryID,
          params,
          result: [],
          resolve
        })
      }

      this.events.emit('queryAdded', queryID)

      if (!this.isProcessing) {
        this.processQueries()
      }
    })

  private processQueries = async (): Promise<void> => {
    this.isProcessing = true
    this.events.emit('processingStarted', undefined)

    while (this.queryQueue.size > 0) {
      const queries = Array.from(this.queryQueue.values())
      this.queryQueue.clear()

      for (const [id, entity] of this.entityMap.entries()) {
        for (const query of queries) {
          const withinTarget =
            query.params.target && isBox(entity) ? intersects(entity, query.params.target) : true
          const matchesID = query.params.ids ? query.params.ids.includes(id) : true
          const matchesFilter = query.params.filter ? query.params.filter(entity) : true

          if (withinTarget && matchesID && matchesFilter) {
            query.result.push(id)
          }
        }
      }

      for (const query of queries) {
        if (query.resolve) {
          query.resolve(query.result)
          query.resolve = null
        }
        this.events.emit(query.queryID, query.result)
      }
    }

    this.isProcessing = false
    this.events.emit('processingFinished', undefined)
  }

  public signalQuery = (id: QueryIdentifier, box: Signal<Box>): Signal<ID[]> =>
    this.system.unique(id, () => {
      const visible = this.system.use(signal<ID[]>(() => [], { equality: arraysEquals }))

      const onChange = async (target: Box) => {
        const r = await this.search(id, { target })
        visible.set(r)
      }

      effect(
        [box, this.ids],
        ([target, ids]) => {
          onChange(target)
        },
        { trigger: true }
      )

      return visible
    })

  public boundingBox = (locations: ID[]): Box => {
    const boxLikeEntities = locations
      .map((l) => this.entityMap.get(l))
      .filter(isNotNullish)
      .filter(isBox)
    return calculateBoundingBox(boxLikeEntities as Box[])
  }
  public dispose = (): void => {
    this.events.dispose()
    this.entityMap.clear()
    this.queryQueue.clear()
    this.isProcessing = false
  }
}

import type { Events, Disposable, Signal } from '@figureland/statekit'
import type { Box } from '@figureland/mathkit/box'
import type { Vector2 } from '@figureland/mathkit/box'

export type QueryIdentifier = string | number | symbol

export type Query<ID extends string = any, Item = any> = {
  queryID: QueryIdentifier
  params: QueryParams<ID, Item>
  result: ID[]
  resolve: ((result: ID[]) => void) | null
}

export type QueryParams<ID extends string, Item> = {
  target?: Box | Vector2
  filter?: (item: Item) => boolean
  ids?: ID[]
}

export type QueryAPI<ID extends string = any, Item = any> = Disposable & {
  readonly queue: Events<Record<QueryIdentifier, ID[]>>
  readonly processing: Signal<boolean>
  add: (id: ID, item: Item) => void
  update: (id: ID, item: Item) => void
  delete: (id: ID) => void
  get: (id: ID) => Item | undefined
  search: (queryID: QueryIdentifier, params: QueryParams<ID, Item>) => Promise<ID[]>
  subscribe: (id: ID) => Signal<Item | undefined>
  signalQuery: <Query extends QueryParams<ID, Item>>(
    id: QueryIdentifier,
    params: Signal<Query>
  ) => Signal<ID[]>
}

export type InferQueryID<T> = T extends QueryAPI<infer ID, any> ? ID : never
export type InferQueryItem<T> = T extends QueryAPI<any, infer Item> ? Item : never

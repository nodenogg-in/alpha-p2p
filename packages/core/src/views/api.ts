import type { PersistenceName, Signal } from '@nodenogg.in/state'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'
import { Microcosm_URI, Node, Node_ID, getMicrocosmURI } from '@nodenogg.in/schema'

export type MicrocosmViews<API extends MicrocosmAPI> = Record<string, ViewFactory<API>>

export interface View<T extends string = string> {
  type: T
  id: string
  dispose: () => Promise<void>
  [key: string]: any
}

export type ViewConfig = {
  id: string
  persist?: PersistenceName
}

export type ViewFactory<API extends MicrocosmAPI = MicrocosmAPI, V extends View = View> = (
  api: API,
  config: ViewConfig
) => Promise<V>

export type APISubscription = {
  node: (node_id: Node_ID) => Signal<Node>
  nodes: () => Signal<string[]>
}

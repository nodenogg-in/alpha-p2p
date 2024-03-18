import type { PersistenceName } from '@nodenogg.in/state'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'

export type Views<API extends MicrocosmAPI> = Record<string, ViewFactory<API>>

export interface View {
  id: string
  dispose: () => Promise<void>
}

export type ViewConfig<API extends MicrocosmAPI> = {
  api: API
  id: string
  persist?: PersistenceName
}

export type ViewFactory<API extends MicrocosmAPI, V extends View = View> = (
  config: ViewConfig<API>
) => V

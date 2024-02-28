import { Microcosms, type MicrocosmFactory, Microcosm, APP_NAME, SCHEMA_VERSION } from '../sync'
import { UIState } from './UIState'

type CreateApp = <M extends Microcosm>(opts: { create: MicrocosmFactory<M> }) => App<M>

export type App<M extends Microcosm> = {
  ui: UIState
  api: Microcosms<M>
}

export const createApp: CreateApp = ({ create }) => {
  const ui = new UIState()
  const api = new Microcosms(create)

  return {
    ui,
    api
  }
}

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]

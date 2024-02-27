import { Microcosms, type MicrocosmFactory, Microcosm, APP_NAME, SCHEMA_VERSION } from '../sync'
import { UIState } from './UIState'
import { UserState } from './state/UserState'

type CreateApp = <M extends Microcosm>(opts: { microcosmFactory: MicrocosmFactory<M> }) => App<M>

export type App<M extends Microcosm> = {
  ui: UIState
  user: UserState
  api: Microcosms<M>
}

export const createApp: CreateApp = ({ microcosmFactory }) => {
  const user = new UserState()
  const ui = new UIState()
  const api = new Microcosms(microcosmFactory, user)

  return {
    ui,
    user,
    api
  }
}

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]

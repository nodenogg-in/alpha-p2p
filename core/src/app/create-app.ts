import { type Microcosm, Microcosms, type MicrocosmFactory } from '../sync'
import { UI } from './UI'
import { UserState } from './state/UserState'

type CreateApp = <M extends Microcosm>(opts: {
  microcosmFactory: MicrocosmFactory<M>
}) => {
  ui: UI
  user: UserState
  microcosms: Microcosms<M>
}

export const createApp: CreateApp = ({ microcosmFactory }) => {
  const ui = new UI()
  const user = new UserState()
  const microcosms = new Microcosms(microcosmFactory, user)
  
  return {
    ui,
    user,
    microcosms
  }
}

import { type Microcosm, Microcosms, type MicrocosmFactory } from '../sync'
import { UI, getPersistenceName } from './UI'

type CreateApp = <M extends Microcosm>(opts: {
  microcosmFactory: MicrocosmFactory<M>
}) => {
  ui: UI
  microcosms: Microcosms<M>
  getPersistenceName: (...name: string[]) => string[]
}

export const createApp: CreateApp = ({ microcosmFactory }) => {
  const ui = new UI()
  const microcosms = new Microcosms(microcosmFactory, ui)

  return {
    ui,
    microcosms,
    getPersistenceName
  }
}

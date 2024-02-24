import { type Microcosm, type MicrocosmAPI, Microcosms, MicrocosmFactory } from '../sync'
import { UI, getPersistenceName } from './UI'

export const createApp: CreateApp = ({ microcosmFactory }) => ({
  ui: new UI(),
  microcosms: new Microcosms(microcosmFactory),
  getPersistenceName
})

type CreateApp = <API extends MicrocosmAPI, M extends Microcosm<API>>(opts: {
  microcosmFactory: MicrocosmFactory<M>
}) => {
  ui: UI
  microcosms: Microcosms<M>
  getPersistenceName: (...name: string[]) => string[]
}

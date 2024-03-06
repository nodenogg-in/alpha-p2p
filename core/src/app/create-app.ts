import { Microcosms, type MicrocosmFactory, Microcosm, APP_NAME, SCHEMA_VERSION } from '../sync'
import { Instance } from './Instance'

export const createApp = <M extends Microcosm>({
  createMicrocosm
}: {
  createMicrocosm: MicrocosmFactory<M>
}) => {
  const api = new Microcosms<M>(createMicrocosm)

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      window.location.reload()
    })
  }

  return {
    session: Instance.session,
    ui: Instance.ui,
    api
  }
}

export const getPersistenceName = (name: string[]) => [APP_NAME, SCHEMA_VERSION.toString(), ...name]

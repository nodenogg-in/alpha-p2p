import { Instance } from './Instance'

export const hmr = () => {
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      Instance.telemetry.log({
        name: 'HMR',
        message: 'Reloading page',
        level: 'status'
      })
      window.location.reload()
    })
  }
}

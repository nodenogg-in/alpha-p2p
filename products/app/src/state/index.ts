import { app } from './app'

export * from './app'
export * from './use-app'
export * from './use-microcosm'
export * from './use-app-router'

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    app.dispose()
    window.location.reload()
  })
}

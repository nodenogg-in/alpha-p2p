import { KeyCommands, OnKeyCommand } from './KeyCommands'

export namespace UI {
  let commands = new KeyCommands()

  export const onKey: OnKeyCommand = (fn) => commands.onMany(fn)

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        commands = new KeyCommands()
      }
    })
  }
}

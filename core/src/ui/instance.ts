import { KeyCommands, OnKeyCommand } from './KeyCommands'
import { Pointer } from './Pointer'

export namespace UI {
  const commands = new KeyCommands()
  export const pointer = new Pointer()

  export const onKeyCommand: OnKeyCommand = (fn) => commands.onMany(fn)

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        console.log('reload')
      }
    })
  }
}

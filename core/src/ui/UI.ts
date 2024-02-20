import { UIKeyCommands, type OnKeyCommand } from './UIKeyCommands'
import { UIPointer } from './UIPointer'

export namespace UI {
  const commands = new UIKeyCommands()

  export const pointer = new UIPointer()

  export const onKeyCommand: OnKeyCommand = (fn) => commands.onMany(fn)

  export const dispose = () => {
    commands.dispose()
    pointer.dispose()
  }

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        console.log('[HMR]: UI instance')
      }
    })
  }
}

import { createEvents } from '@figureland/statekit'
import { preventEvents, type ListenerTarget } from '../utils/dom-events'
import { tinykeys } from '../libs/tinykeys'

export enum Commands {
  all,
  copy,
  cut,
  paste,
  backslash,
  undo,
  redo,
  backspace,
  escape,
  command,
  n,
  c,
  m,
  v,
  h,
  j,
  r,
  save,
  space,
  zoomReset,
  zoomIn,
  zoomOut
}

type KeyCommandsOptions = {
  target?: ListenerTarget
}
export const createKeyCommands = ({ target = window }: KeyCommandsOptions = {}) => {
  const events = createEvents<typeof Commands>()

  const key = (key: keyof typeof Commands) => (e: KeyboardEvent) => {
    preventEvents(e)
    events.emit(key, Commands[key])
  }

  const unsubscribe = tinykeys(target as Window | HTMLElement, {
    '$mod+A': key('all'),
    '$mod+C': key('copy'),
    '$mod+X': key('cut'),
    '$mod+V': key('paste'),
    '$mod+\\': key('backslash'),
    '$mod+Shift+Z': key('redo'),
    '$mod+Z': key('undo'),
    '$mod+K': key('command'),
    '$mod+S': key('save'),
    Space: key('space'),
    Backspace: key('backspace'),
    Escape: key('escape'),
    n: key('n'),
    m: key('m'),
    v: key('v'),
    h: key('h'),
    c: key('c'),
    j: key('j'),
    r: key('r'),
    'Shift+)': key('zoomReset'),
    'Shift++': key('zoomIn'),
    'Shift+_': key('zoomOut')
  })

  return {
    ...events,
    dispose: async () => {
      events.dispose()
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }
}

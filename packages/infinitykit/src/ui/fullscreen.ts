import { type Signal, manager, signal, type Disposable } from '@figureland/statekit'
import { createListener } from '../utils/dom-events'

export const supportsFullscreen = (): boolean =>
  ('fullscreenEnabled' in document && !!document.fullscreenEnabled) ||
  'webkitFullscreenEnabled' in document

export const createFullscreen = (): Fullscreen => {
  const { use, dispose } = manager()
  const available = use(signal(supportsFullscreen))
  const active = use(signal(() => false))

  const setActive = () => active.set(true)
  const setInactive = () => active.set(false)
  const setUnavailable = () => available.set(false)

  use(
    createListener(document, 'fullscreenchange', () => {
      if (!document.fullscreenElement && active.get()) {
        setInactive()
      }
    })
  )

  const open = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen().then(setActive).catch(setUnavailable)
    }
  }
  const close = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(setInactive).catch(setInactive)
    }
  }

  return {
    open,
    close,
    available,
    active,
    dispose
  }
}

export type Fullscreen = Disposable & {
  open: (element: HTMLElement) => void
  close: () => void
  available: Signal<boolean>
  active: Signal<boolean>
}

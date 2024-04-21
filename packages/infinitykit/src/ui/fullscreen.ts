import { Signal, manager, signal } from '@figureland/statekit'
import { createListener } from '../utils/dom-events'

export const supportsFullscreen = (): boolean =>
  ('fullscreenEnabled' in document && !!document.fullscreenEnabled) ||
  'webkitFullscreenEnabled' in document

export const createFullscreen = (): Fullscreen => {
  const s = manager()
  const available = s.use(signal(supportsFullscreen))
  const active = s.use(signal(() => false))

  const setActive = () => active.set(true)
  const setInactive = () => active.set(false)
  const setUnavailable = () => available.set(false)

  s.use(
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
    active
  }
}

export type Fullscreen = {
  open: (element: HTMLElement) => void
  close: () => void
  available: Signal<boolean>
  active: Signal<boolean>
}

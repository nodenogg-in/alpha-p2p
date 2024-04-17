import { signalObject } from '@figureland/statekit'
import { dp } from '@figureland/mathkit'
import { createListener } from '../utils/dom-events'
import type { Size } from '@figureland/mathkit/size'

export type ScreenState = {
  visible: boolean
  size: Size
  scale: number
  orientation: ScreenOrientation
}

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth, 3)

export const createScreen = () => {
  const s = signalObject({
    visible: true,
    size: getWindowSize(),
    scale: getWindowScale(),
    orientation: 'landscape-primary'
  })

  const resizeListener = () => {
    s.set({
      scale: getWindowScale(),
      size: getWindowSize()
    })
  }

  const onVisibilityChange = () => {
    s.set({
      visible: document.visibilityState !== 'hidden'
    })
  }

  const onOrientationChange = () => {
    s.set({
      orientation: screen.orientation.type
    })
  }

  s.use(
    createListener(screen.orientation, 'change', onOrientationChange),
    createListener(document, 'visibilitychange', onVisibilityChange),
    createListener(document, 'resize', resizeListener)
  )
  return s
}

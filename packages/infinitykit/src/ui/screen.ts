import { SignalObject, signalObject } from '@figureland/statekit'
import { dp } from '@figureland/mathkit'
import { createListener } from '../utils/dom-events'
import type { Size } from '@figureland/mathkit/size'

export type ScreenState = {
  visible: boolean
  size: Size
  scale: number
  orientation: OrientationType
}

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth, 3)

export const createScreen = (): Screen => {
  const state = signalObject<ScreenState>({
    visible: true,
    size: getWindowSize(),
    scale: getWindowScale(),
    orientation: 'landscape-primary'
  })

  const resizeListener = () => {
    state.set({
      scale: getWindowScale(),
      size: getWindowSize()
    })
  }

  const onVisibilityChange = () => {
    state.set({
      visible: document.visibilityState !== 'hidden'
    })
  }

  const onOrientationChange = () => {
    if (screen.orientation) {
      state.set({
        orientation: screen.orientation.type
      })
    }
  }

  state.use(createListener(screen.orientation, 'change', onOrientationChange))
  state.use(createListener(document, 'visibilitychange', onVisibilityChange))
  state.use(createListener(document, 'resize', resizeListener))

  return state
}

export type Screen = SignalObject<ScreenState>

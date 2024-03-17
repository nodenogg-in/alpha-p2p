import { State } from '@nodenogg.in/state'
import { dp } from '@nodenogg.in/utils'
import {
  allowEvent,
  isPointerEvent,
  PointerInteractionEvent,
  preventEvents
} from './pointer-events'
import {
  defaultPointerState,
  defaultVec2,
  PointerState,
  PointerType,
  Size
} from '@nodenogg.in/spatial-view'

export type ScreenState = {
  visible: boolean
  size: Size
  scale: number
}

const defaultScreenState = (): ScreenState => ({
  visible: true,
  size: getWindowSize(),
  scale: getWindowScale()
})

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth, 3)

type DOMElement = Window | HTMLElement

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

type CreatePointer = {
  filterEvents?: EventFilter
}

export class Screen extends State<{ pointer: PointerState; screen: ScreenState }> {
  filterEvents: EventFilter
  target: DOMElement

  constructor({ filterEvents = preventEvents }: CreatePointer = {}, target: DOMElement = window) {
    super({
      initial: () => ({
        pointer: defaultPointerState(),
        screen: defaultScreenState()
      })
    })
    this.target = target
    this.filterEvents = filterEvents

    document.addEventListener('gesturestart', this.prevent)
    document.addEventListener('gesturestart', this.prevent)
    document.addEventListener('gesturechange', this.prevent)
    document.addEventListener('gestureend', this.prevent)
    this.target.addEventListener('wheel', this.prevent, { passive: false })
    this.target.addEventListener('touchstart', this.prevent)
    this.target.addEventListener('pointermove', (e) => this.onPointerMove(e as PointerEvent))
    this.target.addEventListener('pointerdown', this.onPointerDown)
    this.target.addEventListener('pointerup', this.onPointerUp)
    this.target.addEventListener('lostpointercapture', this.onPointerUp)
    this.target.addEventListener('visibilitychange', this.onVisibilityChange)
    window.addEventListener('resize', this.resizeListener)

    this.onDispose(() => {
      document.removeEventListener('gesturestart', this.prevent)
      document.removeEventListener('gesturechange', this.prevent)
      document.removeEventListener('gestureend', this.prevent)
      this.target.removeEventListener('wheel', this.prevent)
      this.target.removeEventListener('touchstart', this.prevent)
      this.target.removeEventListener('pointermove', this.onPointerMove)
      this.target.removeEventListener('pointerdown', this.onPointerDown)
      this.target.removeEventListener('pointerup', this.onPointerUp)
      this.target.removeEventListener('lostpointercapture', this.onPointerUp)
      this.target.removeEventListener('visibilitychange', this.onVisibilityChange)
      window.removeEventListener('resize', this.resizeListener)
    })
  }

  private resizeListener = () => {
    this.key('screen').set({
      scale: getWindowScale(),
      size: getWindowSize()
    })
  }

  private onPointerDown = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }
    const { button, pointerType, shiftKey, metaKey } = e
    this.prevent(e)

    this.key('pointer').set({
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: defaultVec2(),
      origin: this.key('pointer').get().point,
      active: true
    })
  }

  private onPointerMove = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }
    const { clientX, clientY, shiftKey, metaKey, ctrlKey, button } = e
    this.prevent(e)

    const point = {
      x: clientX,
      y: clientY
    }

    const current = this.key('pointer').get()
    const delta = current.active
      ? {
          x: point.x - current.point.x,
          y: point.y - current.point.y
        }
      : defaultVec2()

    const hasDelta = delta.x !== 0 || delta.y !== 0

    this.key('pointer').set({
      button,
      metaKey,
      shiftKey,
      ctrlKey,
      point,
      delta,
      hasDelta
    })
  }

  private onPointerUp = (e: PointerInteractionEvent) => {
    this.prevent(e)
    this.key('pointer').set({
      button: null,
      delta: defaultVec2(),
      pointerType: null,
      pinching: false,
      active: false,
      shiftKey: false,
      metaKey: false,
      ctrlKey: false,
      hasDelta: false
    })
  }

  private onVisibilityChange = () => {
    this.key('screen').set({
      visible: document.visibilityState !== 'hidden'
    })
  }

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))
}

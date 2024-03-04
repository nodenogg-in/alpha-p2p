import { defaultVec2, type Size, type Vec2 } from '../../schema'
import { dp, State } from '../../utils'
import {
  allowEvent,
  isPointerEvent,
  PointerInteractionEvent,
  preventEvents
} from '../../utils/pointer-events'

export type ScreenState = {
  visible: boolean
  size: Size
  scale: number
}

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  button: number | null
  touchDistance: number
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  origin: Vec2
  delta: Vec2
  point: Vec2
  pinching: boolean
  pointerType: PointerType | null
  active: boolean
  over: boolean
  hasDelta: boolean
}

const defaultScreenState = (): ScreenState => ({
  visible: true,
  size: getWindowSize(),
  scale: getWindowScale()
})

const getWindowSize = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
const getWindowScale = (): number => dp(window.outerWidth / window.innerWidth, 3)

export const defaultPointerState = (): PointerState => ({
  touchDistance: 0,
  shiftKey: false,
  metaKey: false,
  ctrlKey: false,
  button: 0,
  point: defaultVec2(),
  delta: defaultVec2(),
  origin: defaultVec2(),
  pinching: false,
  pointerType: null,
  active: false,
  over: false,
  hasDelta: false
})

type DOMElement = Window | HTMLElement

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

type CreatePointer = {
  filterEvents?: EventFilter
}

export class WindowState extends State<{ pointer: PointerState; screen: ScreenState }> {
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
    this.setKey('screen', {
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

    this.setKey('pointer', {
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: defaultVec2(),
      origin: this.getKey('pointer').point,
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

    const current = this.getKey('pointer')
    const delta = current.active
      ? {
          x: point.x - current.point.x,
          y: point.y - current.point.y
        }
      : defaultVec2()

    const hasDelta = delta.x !== 0 || delta.y !== 0

    this.setKey('pointer', {
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
    this.setKey('pointer', {
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
    this.setKey('screen', { visible: document.visibilityState !== 'hidden' })
  }

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))
}

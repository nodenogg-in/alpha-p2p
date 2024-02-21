import { defaultVec2, type Vec2 } from '../schema'
import { dp, State } from '../utils'

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  touchDistance: number
  shiftKey: boolean
  metaKey: boolean
  origin: Vec2
  delta: Vec2
  point: Vec2
  windowScale: number
  pinching: boolean
  pointerType: PointerType | null
  active: boolean
  visible: boolean
}

const getWindowScale = () => dp(window.outerWidth / window.innerWidth, 3)

export const defaultPointerState = (): PointerState => ({
  touchDistance: 0,
  shiftKey: false,
  metaKey: false,
  point: defaultVec2(),
  delta: defaultVec2(),
  origin: defaultVec2(),
  windowScale: getWindowScale(),
  pinching: false,
  pointerType: null,
  active: false,
  visible: true
})

export const UI_CLASS = 'ui'

const allowEvent = (e: PointerInteractionEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return true
  }
  if (e.target instanceof HTMLElement && e.target.classList?.contains(UI_CLASS)) {
    return true
  }
  return false
}

export type PointerInteractionEvent = WheelEvent | PointerEvent | MouseEvent | TouchEvent

const preventEvents = (e: PointerInteractionEvent) => {
  if (!allowEvent(e)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

type DOMElement = Window | HTMLElement

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

type CreatePointer = {
  filterEvents?: EventFilter
}

export class Pointer extends State<{ pointerState: PointerState }> {
  filterEvents: EventFilter
  target: DOMElement

  constructor({ filterEvents = preventEvents }: CreatePointer = {}, target: DOMElement = window) {
    super(() => ({ pointerState: defaultPointerState() }))
    this.target = target
    this.filterEvents = filterEvents
    document.addEventListener('gesturestart', this.prevent)
    document.addEventListener('gesturechange', this.prevent)
    document.addEventListener('gestureend', this.prevent)
    this.target.addEventListener('wheel', this.prevent, { passive: false })
    this.target.addEventListener('touchstart', this.prevent)
    this.target.addEventListener('pointermove', this.updateCursorPosition)
    this.target.addEventListener('pointerdown', this.onPointerDown)
    this.target.addEventListener('pointerup', this.onPointerUp)
    this.target.addEventListener('visibilitychange', this.visibilityListener)
    window.addEventListener('resize', this.resizeListener)
  }

  private resizeListener = () => {
    this.set('pointerState', { windowScale: getWindowScale() })
  }

  private updateCursorPosition = ({ clientX, clientY, shiftKey, metaKey }: PointerEvent) => {
    const current = this.get('pointerState')
    const delta = current.active
      ? {
          x: current.point.x - current.origin.x,
          y: current.point.y - current.origin.y
        }
      : defaultVec2()

    this.set('pointerState', {
      metaKey,
      shiftKey,
      point: {
        x: clientX,
        y: clientY
      },
      delta
    })
  }

  private onPointerDown = ({ button, pointerType, shiftKey, metaKey }: PointerEvent) => {
    if (button === 2) {
      return
    }

    const origin = this.get('pointerState').point

    this.set('pointerState', {
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: defaultVec2(),
      origin,
      active: true
    })
  }
  private onPointerUp = () => {
    this.set('pointerState', {
      delta: defaultVec2(),
      pointerType: null,
      pinching: false,
      active: false,
      shiftKey: false,
      metaKey: false
    })
  }

  private onVisibilityChange = (visible: boolean) => {
    this.set('pointerState', { visible })
  }

  private visibilityListener = () => {
    this.onVisibilityChange(document.visibilityState !== 'hidden')
  }

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))

  public dispose = () => {
    document.removeEventListener('gesturestart', this.prevent)
    document.removeEventListener('gesturechange', this.prevent)
    document.removeEventListener('gestureend', this.prevent)
    this.target.removeEventListener('wheel', this.prevent)
    this.target.removeEventListener('touchstart', this.prevent)
    this.target.removeEventListener('pointermove', this.updateCursorPosition)
    this.target.removeEventListener('pointerdown', this.onPointerDown)
    this.target.removeEventListener('pointerup', this.onPointerUp)
    this.target.removeEventListener('visibilitychange', this.visibilityListener)
    window.removeEventListener('resize', this.resizeListener)
    this.clearListeners()
  }
}

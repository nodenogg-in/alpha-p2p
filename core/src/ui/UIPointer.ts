import { defaultVec2, type Vec2 } from '../schema'
import { assign, dp, Emitter } from '../utils'

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  touchDistance: number
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

type UIPointerEvents = {
  state: PointerState
}

export class UIPointer extends Emitter<UIPointerEvents> {
  state = defaultPointerState()
  filterEvents: EventFilter
  target: DOMElement

  constructor({ filterEvents = preventEvents }: CreatePointer = {}, target: DOMElement = window) {
    super()
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
    this.set({ windowScale: getWindowScale() })
  }

  private updateCursorPosition = (event: PointerEvent) => {
    const { clientX: x, clientY: y } = event
    const delta = {
      x: this.state.active ? this.state.point.x - this.state.origin.x : 0,
      y: this.state.active ? this.state.point.y - this.state.origin.y : 0
    }

    this.set({
      point: { x, y },
      delta
    })
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 2) {
      return
    }

    this.set({
      pointerType: e.pointerType as PointerType,
      delta: defaultVec2(),
      origin: { ...this.state.point },
      active: true
    })
  }
  private onPointerUp = () => {
    this.set({ delta: defaultVec2(), pinching: false, active: false })
  }

  private onVisibilityChange = (visible: boolean) => {
    this.set({ visible })
  }

  private visibilityListener = () => {
    this.onVisibilityChange(document.visibilityState !== 'hidden')
  }

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))

  private requestUpdate = () => this.emit('state', this.state)

  private set = (state: Partial<PointerState> = {}) => {
    assign(this.state, state)
    requestAnimationFrame(this.requestUpdate)
  }

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
  }
}

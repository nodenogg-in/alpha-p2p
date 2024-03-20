import { defaultVec2, type Size, type Vec2 } from '../../schema'
import { dp, State } from '../../utils'

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
  metaKey: boolean
  origin: Vec2
  delta: Vec2
  point: Vec2
  pinching: boolean
  pointerType: PointerType | null
  active: boolean
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
  button: 0,
  point: defaultVec2(),
  delta: defaultVec2(),
  origin: defaultVec2(),
  pinching: false,
  pointerType: null,
  active: false
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
    document.addEventListener('gesturechange', this.prevent)
    document.addEventListener('gestureend', this.prevent)
    this.target.addEventListener('wheel', this.prevent, { passive: false })
    this.target.addEventListener('touchstart', this.prevent)
    this.target.addEventListener('pointermove', this.onPointerMove)
    this.target.addEventListener('pointerdown', this.onPointerDown)
    this.target.addEventListener('pointerup', this.onPointerUp)
    this.target.addEventListener('visibilitychange', this.onVisibilityChange)
    window.addEventListener('resize', this.resizeListener)
  }

  private resizeListener = () => {
    this.set('screen', {
      scale: getWindowScale(),
      size: getWindowSize()
    })
  }

  private onPointerDown = (e: PointerEvent) => {
    const { button, pointerType, shiftKey, metaKey } = e
    this.prevent(e)

    const origin = this.get('pointer').point

    this.set('pointer', {
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: defaultVec2(),
      origin,
      active: true
    })
  }

  private onPointerMove = (e: PointerEvent) => {
    const { clientX, clientY, shiftKey, metaKey, button } = e
    this.prevent(e)

    const current = this.get('pointer')
    const delta = current.active
      ? {
          x: current.point.x - current.origin.x,
          y: current.point.y - current.origin.y
        }
      : defaultVec2()

    this.set('pointer', {
      button,
      metaKey,
      shiftKey,
      point: {
        x: clientX,
        y: clientY
      },
      delta
    })
  }

  private onPointerUp = (e: PointerInteractionEvent) => {
    this.prevent(e)
    this.set('pointer', {
      button: null,
      delta: defaultVec2(),
      pointerType: null,
      pinching: false,
      active: false,
      shiftKey: false,
      metaKey: false
    })
  }

  private onVisibilityChange = () => {
    this.set('screen', { visible: document.visibilityState !== 'hidden' })
  }

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))

  public dispose = () => {
    document.removeEventListener('gesturestart', this.prevent)
    document.removeEventListener('gesturechange', this.prevent)
    document.removeEventListener('gestureend', this.prevent)
    this.target.removeEventListener('wheel', this.prevent)
    this.target.removeEventListener('touchstart', this.prevent)
    this.target.removeEventListener('pointermove', this.onPointerMove)
    this.target.removeEventListener('pointerdown', this.onPointerDown)
    this.target.removeEventListener('pointerup', this.onPointerUp)
    this.target.removeEventListener('visibilitychange', this.onVisibilityChange)
    window.removeEventListener('resize', this.resizeListener)
    this.clearListeners()
  }
}
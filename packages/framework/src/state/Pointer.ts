import { State } from '@figureland/statekit'
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
} from '@figureland/infinitykit'
import { createListener, ListenerTarget } from './dom-events'

type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void

type CreatePointer = {
  filterEvents?: EventFilter
}

export class Pointer extends State<PointerState> {
  filterEvents: EventFilter

  constructor(
    {
      filterEvents = preventEvents
    }: {
      filterEvents?: EventFilter
    } = {},
    target: ListenerTarget = window
  ) {
    super({ initial: defaultPointerState })
    this.filterEvents = filterEvents

    this.use(
      createListener(document, 'gesturestart', this.prevent),
      createListener(document, 'gesturechange', this.prevent),
      createListener(document, 'gestureend', this.prevent),
      createListener(target, 'wheel', this.prevent),
      createListener(target, 'touchstart', this.prevent),
      createListener(target, 'pointermove', this.onPointerMove),
      createListener(target, 'pointerdown', this.onPointerDown),
      createListener(target, 'pointerup', this.onPointerUp),
      createListener(target, 'lostpointercapture', this.onPointerUp)
    )
  }

  private onPointerDown = (e: PointerInteractionEvent) => {
    if (!isPointerEvent(e)) {
      return
    }

    const { button, pointerType, shiftKey, metaKey } = e
    this.prevent(e)

    this.set({
      button,
      metaKey,
      shiftKey,
      pointerType: pointerType as PointerType,
      delta: defaultVec2(),
      origin: this.get().point,
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

    const current = this.get()
    const delta = current.active
      ? {
          x: point.x - current.point.x,
          y: point.y - current.point.y
        }
      : defaultVec2()

    const hasDelta = delta.x !== 0 || delta.y !== 0

    this.set({
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
    this.set({
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

  private prevent = (e: PointerInteractionEvent) => this.filterEvents(e, allowEvent(e))
}

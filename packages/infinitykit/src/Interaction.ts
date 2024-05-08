import { vector2 } from '@figureland/mathkit/vector2'
import { system } from '@figureland/statekit'
import type { Pointer, PointerInteractionEvent } from '@figureland/toolkit/pointer'
import type { Actions } from './Actions'
import type { Canvas } from './Canvas'

export class Interaction<A extends Actions, C extends Canvas, P extends Pointer> {
  system = system()
  constructor(
    private actions: A,
    private canvas: C,
    private pointer: P
  ) {
    this.system.use(
      pointer.key('point').on(() => {
        if (actions.state.key('focused')) actions.update(pointer.get())
      })
    )
  }

  public onPointerDown = (e: PointerInteractionEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }
    this.actions.start(this.pointer.get())
  }
  public onPointerUp = () => {
    this.actions.finish(this.pointer.get())
  }
  public onPointerOver = () => {
    this.actions.focus()
  }
  public onPointerMove = () => {
    this.actions.update(this.pointer.get())
  }
  public onPointerOut = () => {
    this.actions.blur()
  }
  public onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0') {
      e.preventDefault()
      target.focus({ preventScroll: true })
    }
    this.actions.focus()
  }
  public onWheel = (e: WheelEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }
    const point = vector2(e.clientX, e.clientY)
    const delta = vector2(e.deltaX, e.deltaY)

    if (delta.y % 1 === 0) {
      this.canvas.pan(delta)
    } else {
      this.canvas.scroll(point, delta)
    }
  }
  public dispose = () => this.system.dispose()
}

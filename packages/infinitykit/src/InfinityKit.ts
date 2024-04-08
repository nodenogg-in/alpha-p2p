import { State } from '@nodenogg.in/statekit'
import { entries } from '@nodenogg.in/toolkit'
import type { Box, BoxReference } from './schema/spatial.schema'
import type { PointerState } from './schema/pointer.schema'
import type { ToolSet } from './tools'
import { Canvas, type CanvasOptions } from './Canvas'
import { intersectBoxWithBox } from './utils/intersection'
import { CanvasActions } from './CanvasActions'

export interface API {
  boxes: <B extends BoxReference = BoxReference>() => (B extends BoxReference ? BoxReference : B)[]
}

export interface EditableAPI extends API {
  create: (boxes: Box[]) => void
}

export class InfinityKit<A extends API = API, T extends ToolSet = ToolSet> extends State<{
  focused: boolean
}> {
  public interaction: Canvas
  public action: CanvasActions<T, this>
  public readonly tools: T

  constructor(
    public readonly api: A,
    { tools, canvas = {} }: { tools: T; canvas?: CanvasOptions }
  ) {
    super({
      initial: () => ({
        focused: false
      })
    })
    this.tools = tools
    this.interaction = new Canvas(canvas)
    this.action = new CanvasActions(this)

    this.use(this.interaction.dispose, this.action.dispose)
  }

  public toolbar = () => entries(this.tools).filter(([_, tool]) => !tool.hidden)

  public hasTool = (tool: keyof T) => !!this.tools[tool]

  public setTool = (tool: keyof T) => {
    if (this.hasTool(tool)) {
      this.action.set({ tool: (tool as string) || 'select' })
    }
  }

  public select = (boxes: string[] = this.api.boxes().map(([id]) => id)) =>
    this.action.key('selection').set({ boxes })

  public isTool = (...tools: (keyof T)[]): boolean => tools.includes(this.action.key('tool').get())

  public onWheel = (e: WheelEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }

    const point = {
      x: e.clientX,
      y: e.clientY
    }

    const delta = {
      x: e.deltaX,
      y: e.deltaY
    }

    if (delta.y % 1 === 0) {
      this.interaction.pan(delta)
    } else {
      this.interaction.scroll(point, delta)
    }
  }

  public update = (pointer: PointerState) => {
    if (this.key('focused').get()) {
      this.action.update(pointer)
    }
  }

  public onPointerOver = () => {
    this.key('focused').set(true)
  }
  public onPointerOut = () => {
    this.key('focused').set(false)
  }

  public onPointerDown = (pointerState: PointerState, e: PointerEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.focus()
    }
    this.action.start(pointerState)
  }

  public onPointerUp = (pointerState: PointerState) => {
    this.action.finish(pointerState)
  }

  public onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0') {
      event.preventDefault()
      target.focus({ preventScroll: true })
    }
  }

  public isBoxWithinViewport = <B extends BoxReference>(box: B): boolean =>
    intersectBoxWithBox(box[1], this.interaction.key('viewport').get())
}

import { type Signal, State, signal } from '@nodenogg.in/state'
import type { Box, BoxReference } from './schema/spatial.schema'
import type { PointerState } from './schema/pointer.schema'
import { Tools, type Tool, type ToolName } from './tools'
import { CanvasInteraction, type CanvasInteractionOptions } from './CanvasInteraction'
import { intersectBoxWithBox } from './utils/intersection'
import { type CanvasStyle, getCanvasStyles } from './canvas-styles'
import { CanvasActions } from './CanvasActions'

export interface API extends State<any> {
  boxes: <R extends BoxReference[]>() => R
  isActive: () => boolean
}

export interface EditableAPI extends API {
  create: (boxes: Box[]) => void
}

export class SpatialKit<A extends API = API> extends State<{ focused: boolean }> {
  public interaction: CanvasInteraction
  public action: CanvasActions<this>
  public readonly styles: Signal<CanvasStyle>
  public readonly tools: ToolName[]

  constructor(
    public readonly api: A,
    options: CanvasInteractionOptions & { tools: ToolName[] }
  ) {
    super({
      initial: () => ({
        focused: false
      })
    })
    this.tools = options.tools
    this.interaction = new CanvasInteraction(options)
    this.action = new CanvasActions(this)

    this.styles = signal(() => {
      const i = this.interaction.get()
      return getCanvasStyles(i)
    })

    this.use(this.interaction.dispose, this.action.dispose)
  }

  public isActive = () => this.api.isActive()

  public toolbar = () => {
    return this.tools
      .map((tool) => [tool, Tools[tool]] as [ToolName, Tool])
      .filter(([, tool]) => !tool.hidden)
  }

  public setTool = (tool: ToolName) => {
    if (this.tools.includes(tool)) {
      this.action.set({ tool: tool || 'select' })
    }
  }

  public select = (boxes: string[] = this.api.boxes().map(([id]) => id)) =>
    this.action.key('selection').set({ boxes })

  public isTool = (...tools: ToolName[]): boolean => tools.includes(this.action.key('tool').get())

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

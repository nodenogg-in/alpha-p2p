import { type Signal, State, derive } from '@nodenogg.in/state'
import type { BoxReference } from './schema'
import type { PointerState } from './pointer.schema'
import { Tools, type Tool, type ToolName } from './tools'
import { CanvasInteraction } from './CanvasInteraction'
import { intersectBoxWithBox } from './intersection'
import { type CanvasStyle, getCanvasStyles } from './canvas-styles'
import { CanvasActions } from './CanvasActions'
import { CanvasAPI, EditableCanvasAPI } from './api'

export class Canvas<API extends CanvasAPI = CanvasAPI> extends State<{ focused: boolean }> {
  public interaction: CanvasInteraction
  public action: CanvasActions<this>
  public readonly tools: ToolName[]
  public readonly styles: Signal<CanvasStyle>

  constructor(
    public readonly api: API,
    public id: string,
    persist?: string[]
  ) {
    super({
      initial: () => ({
        focused: false
      })
    })
    this.interaction = new CanvasInteraction(persist)
    this.action = new CanvasActions(this)

    this.tools = this.isEditable() ? ['select', 'move', 'new', 'connect'] : ['select', 'move']

    this.styles = derive([this.interaction], getCanvasStyles)

    this.onDispose(this.interaction.dispose, this.action.dispose)
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
    console.log('hello!!')
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

  public onDropFiles = async (files: File[] | null) => {
    if (this.isEditable() && files && this.api.onDropFiles) {
      this.api.onDropFiles(this, files)
    } else {
      return []
    }
  }

  public isBoxWithinViewport = <B extends BoxReference>(box: B): boolean =>
    intersectBoxWithBox(box[1], this.interaction.key('viewport').get())

  public isEditable = (): this is Canvas<EditableCanvasAPI> => this.api.isEditable()
}

import { State } from '@nodenogg.in/state'
import type { Box, BoxReference, Vec2 } from './schema'
import type { PointerState } from './pointer.schema'
import { Tools, type Tool, type ToolName } from './tools'
import { CanvasInteraction } from './CanvasInteraction'
import { intersectBoxWithBox } from './intersection'
import { type CanvasStyleState, canvasStyles } from './canvas-styles'
import { CanvasActions } from './CanvasActions'
import { getViewCenter } from '.'

export interface DataAPI extends State<any> {
  boxes: () => BoxReference[]
  isActive: () => boolean
  isEditable(): boolean
}

export interface EditableDataAPI extends DataAPI {
  create: (nodes: Box[]) => void
  onDropFiles?: (data: File[], position: Vec2) => void
}

export class Canvas<API extends DataAPI = DataAPI> extends State<{ focused: boolean }> {
  public interaction: CanvasInteraction
  public action: CanvasActions<this>
  public readonly tools: ToolName[]
  public readonly styles: CanvasStyleState

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

    this.styles = canvasStyles(this.interaction)
  }

  public isActive = () => this.api.isActive()

  get toolbar() {
    return this.tools
      .map((tool) => [tool, Tools[tool]] as [ToolName, Tool])
      .filter(([, tool]) => !tool.hidden)
  }

  public setTool = (tool: ToolName) => {
    if (this.tools.includes(tool)) {
      this.action.set({ tool: tool || 'select' })
    }
  }

  public select = (nodes: string[] = this.api.boxes().map(([id]) => id)) => {
    this.action.setKey('selection', { nodes })
  }

  public isTool = (...tools: ToolName[]): boolean => tools.includes(this.action.getKey('tool'))

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
    if (this.getKey('focused')) {
      this.action.update(pointer)
    }
  }

  public onPointerOver = () => {
    this.set({ focused: true })
  }
  public onPointerOut = () => {
    this.set({ focused: false })
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

  public onDropFiles = async (files: File[] | null) => {
    if (this.isEditable() && files) {
      if (this.api.onDropFiles) {
        this.api.onDropFiles(files, getViewCenter(this.interaction.get()))
      }
    } else {
      return []
    }
  }

  public isBoxWithinViewport = <B extends BoxReference>(box: B): boolean =>
    intersectBoxWithBox(box[1], this.interaction.getKey('viewport'))

  public isEditable = (): this is Canvas<EditableDataAPI> => this.api.isEditable()

  public dispose = () => {
    this.interaction.dispose()
    // this.action.dispose()
  }
}

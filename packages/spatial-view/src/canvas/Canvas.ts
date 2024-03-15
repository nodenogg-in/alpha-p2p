import { State } from '@nodenogg.in/state'
import type { Box, BoxReference } from '../schema'
import type { PointerState } from '../pointer.schema'
import { parseFileToHTMLString } from '@nodenogg.in/parsers'
import { isString } from '@nodenogg.in/utils'
import { Tools, type Tool, type ToolName } from '../tools'
import { assignBoxPositions } from '../layout'
import { CanvasInteraction } from './CanvasInteraction'
import { intersectBoxWithBox } from './intersection'
import { type CanvasStyleState, canvasStyles } from './canvas-styles'
import { CanvasActions } from './CanvasActions'

export interface DataAPI extends State<any> {
  boxes: () => BoxReference[]
  isActive: () => boolean
  isEditable(): boolean
}

export interface EditableDataAPI extends DataAPI {
  create: (nodes: Box[]) => void
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

  public onWheel = (e: WheelEvent & { target: HTMLElement }) => {
    e.target.focus()

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

  public onPointerDown = (
    pointerState: PointerState,
    e: PointerEvent & { target: HTMLElement }
  ) => {
    e.target.focus()
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
      const canvas = this.interaction.get()
      const parsed = await Promise.all(files.map(parseFileToHTMLString))
      const nodes = parsed.filter(isString).map((content) => ({
        type: 'html',
        content
      }))

      const positionedBoxes = assignBoxPositions(canvas, nodes)
      this.api.create(positionedBoxes)
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

import type { BoxReference } from '../../schema'
import type { PointerState } from '../../app'
import type { Microcosm, EditableMicrocosmAPI } from '../../sync'
import { Tools, type Tool, type ToolName } from '../tools'
import { isString, parseFileToHTMLString, State } from '../../utils'
import { assignNodePositions } from '../layout'
import { CanvasInteraction } from './CanvasInteraction'
import { intersectBoxWithBox } from './intersection'
import { Instance } from '../../app/Instance'
import { CanvasStyleState, canvasStyles } from './canvas-styles'
import { CanvasActions } from './CanvasActions'

type CanvasOptions = {
  persist?: string[]
}

export class Canvas<M extends Microcosm = Microcosm> extends State<{ focused: boolean }> {
  public interaction: CanvasInteraction
  public action: CanvasActions<this>
  public readonly tools: ToolName[]
  public readonly styles: CanvasStyleState
  p
  constructor(
    public readonly microcosm: M,
    { persist }: CanvasOptions = {}
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

    Instance.ui.screen.onKey('pointer', this.update)
    Instance.ui.keyboard.onCommand({
      all: () => {
        if (this.isActive()) {
          this.select()
        }
      },
      h: () => {
        if (this.isActive()) {
          this.setTool('move')
        }
      },
      v: () => {
        if (this.isActive()) {
          this.setTool('select')
        }
      },
      n: () => {
        if (this.isActive()) {
          this.setTool('new')
        }
      },
      c: () => {
        if (this.isActive()) {
          this.setTool('connect')
        }
      },
      backspace: () => {
        if (this.isActive()) {
          console.log('backspace')
        }
      },
      space: () => {
        if (this.isActive()) {
          this.setTool('move')
        }
      }
    })
  }

  public isActive = () => this.microcosm.isActive()

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

  public select = (nodes: string[] = this.microcosm.api.nodes('html').map(([id]) => id)) => {
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

  public onPointerDown = (e: PointerEvent & { target: HTMLElement }) => {
    e.target.focus()
    this.action.start(Instance.ui.screen.getKey('pointer'))
  }

  public onPointerUp = () => {
    this.action.finish(Instance.ui.screen.getKey('pointer'))
  }

  public onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
      event.preventDefault()
      target.focus({ preventScroll: true })
      const { node_id } = target.dataset
      console.log(node_id)
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

      const positionedNodes = assignNodePositions(canvas, nodes)
      this.microcosm.api.create(positionedNodes)
    }
  }

  public isBoxWithinViewport = <B extends BoxReference>(box: B): boolean =>
    intersectBoxWithBox(box[1], this.interaction.getKey('viewport'))

  public isEditable = (): this is Canvas<Microcosm<EditableMicrocosmAPI>> =>
    this.microcosm.isEditable()

  public dispose = () => {
    this.interaction.dispose()
    // this.action.dispose()
  }
}

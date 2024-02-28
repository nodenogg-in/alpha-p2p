import type { Box, Vec2 } from '../../schema'
import { DEFAULT_TOOL, MINIMUM_NODE_SIZE } from '../constants'
import { TOOLS, type Tool, type ToolName } from '../tools'
import { isString, parseFileToHTMLString, State } from '../../utils'
import { defaultBox, defaultVec2 } from '../../schema'
import { getSelectionBox, screenToCanvas } from './interaction'
import type { PointerState } from '../../app'
import { assignNodePositions } from '../layout'
import type { Microcosm } from '../../sync/microcosm/Microcosm'
import { CanvasInteraction } from './CanvasInteraction'
import { intersect, isWithin } from './intersection'
import type { EditableMicrocosmAPI } from '../../sync'

type ActionsState = {
  tool: ToolName
  action: boolean
  selectedNodes: string[]
  editingNode: string | null
}

export type SelectionState = {
  box: Box
  point: Vec2
  nodes: string[]
  group: Box
  target: string | null
}

export const defaultSelectionState = (): SelectionState => ({
  point: defaultVec2(),
  box: defaultBox(),
  nodes: [],
  group: defaultBox(),
  target: null
})

export const defaultActionsState = (): ActionsState => ({
  tool: DEFAULT_TOOL,
  action: false,
  selectedNodes: [],
  editingNode: null
})

type CanvasOptions = {
  persist?: string[]
}

export class Canvas<M extends Microcosm = Microcosm> {
  protected microcosm: M
  public interaction: CanvasInteraction
  public action = new State({ initial: defaultActionsState })
  public selection = new State({ initial: defaultSelectionState })
  public readonly tools: ToolName[] = ['select', 'move']

  constructor(microcosm: M, { persist }: CanvasOptions = {}) {
    this.microcosm = microcosm
    this.interaction = new CanvasInteraction(persist)
  }

  public toolbar = () =>
    this.tools
      .map((tool) => [tool, TOOLS[tool]] as [ToolName, Tool])
      .filter(([, tool]) => !tool.hidden)

  public setTool = (tool: ToolName) => {
    if (this.tools.includes(tool)) {
      this.action.set({ tool: tool || 'select' })
    }
  }

  public isTool = (...tools: ToolName[]): boolean => tools.includes(this.action.getKey('tool'))

  public start = ({ shiftKey }: PointerState) => {
    // const distance = touch ? pointer.state.touchDistance : undefined
    const selection = this.selection.get()
    const action = this.action.get()

    if (this.isTool('select', 'edit')) {
      const isSelection = selection.nodes.length > 0
      if (!isSelection) {
        this.action.set({
          selectedNodes: [],
          editingNode: null,
          action: true
        })
      } else {
        if (action.selectedNodes.length === 1 && selection.target === action.selectedNodes[0]) {
          this.action.set({
            editingNode: action.selectedNodes[0]
          })
        } else if (
          selection.target &&
          action.selectedNodes.length >= 1 &&
          !action.selectedNodes.includes(selection.target) &&
          shiftKey
        ) {
          const nodes = [...action.selectedNodes, selection.target]
          this.action.setKey('selectedNodes', nodes)
        } else {
          this.action.set({
            selectedNodes: selection.target ? [selection.target] : [],
            editingNode: null
          })
        }
      }
    } else {
      this.action.set({
        action: true
      })
    }
    this.interaction.storeState()
  }

  public update = (pointer: PointerState) => {
    // console.log('update action')

    const action = this.action.get()
    this.selection.set(() => this.getSelection(pointer))
    if (pointer.active) {
      // if (pointer.pinching) {
      //   pinch(pointer.touchDistance)
      // } else {
      // if (this.isTool(Tool.Select)) {
      //   if (this.state.action.action) {
      //     this.setKey('selection', this.getSelection(pointer))
      //   }
      // }
      if (this.isTool('move') && action.action) {
        this.interaction.move(pointer.delta)
      }
      // if (this.isTool(Tool.New) && this.state.action.action) {
      //   this.setKey('selection', this.getSelection(pointer))
      // }
    }
  }

  public finish = (pointer: PointerState) => {
    if (!pointer) {
      return
    }

    const selection = this.selection.get()

    if (this.isTool('select')) {
      if (selection.nodes.length > 0) {
        this.action.setKey('selectedNodes', () => [...selection.nodes])
      }
    }
    this.action.setKey('action', () => false)
    this.reset()
    this.interaction.storeState()
  }

  public onWheel = (e: WheelEvent) => {
    const point = {
      x: e.clientX,
      y: e.clientY
    }

    const delta = {
      x: e.deltaX,
      y: e.deltaY
    }

    if (!this.isTool('move') && delta.y % 1 === 0) {
      this.interaction.pan(delta)
    } else {
      this.interaction.scroll(point, delta)
    }
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

  resetSelection = () => {
    this.selection.set(defaultSelectionState)
  }

  reset = () => {
    this.resetSelection()
  }

  private getSelection = ({ delta, origin, point }: PointerState): SelectionState => {
    const canvas = this.interaction.get()
    const box = getSelectionBox(origin, delta)

    const selection = intersect(
      this.microcosm.api.nodes('html'),
      screenToCanvas(canvas, point),
      screenToCanvas(canvas, box)
    )

    return {
      box,
      point,
      ...selection
    }
  }

  public isBoxWithinViewport = (box: Box): boolean =>
    isWithin(box, this.interaction.getKey('viewport').canvas)

  public dispose = () => {
    this.action.clearListeners()
    this.interaction.clearListeners()
  }
}

export class EditableCanvas extends Canvas {
  public readonly tools: ToolName[] = ['select', 'move', 'edit', 'connect', 'new']

  protected declare microcosm: Microcosm<EditableMicrocosmAPI>

  public finish = (pointer: PointerState) => {
    if (!pointer) {
      return
    }

    const selection = this.selection.get()

    if (this.isTool('new')) {
      const node = this.interaction.screenToCanvas(selection.box)
      if (node.width > MINIMUM_NODE_SIZE.width && node.height > MINIMUM_NODE_SIZE.height) {
        this.microcosm.api.create({
          type: 'html',
          content: '',
          ...node
        })
      }
    }

    if (this.isTool('select')) {
      if (selection.nodes.length > 0) {
        this.action.setKey('selectedNodes', () => [...selection.nodes])
      }
    }
    this.action.setKey('action', () => false)
    this.reset()
    this.interaction.storeState()
  }

  public onDropFiles = (files: File[] | null) => {
    if (!files) {
      return
    }
    const canvas = this.interaction.get()

    Promise.all(files.map(parseFileToHTMLString)).then((results) => {
      const filesHTML = results.filter(isString)

      const nodes = filesHTML.map((content) => ({
        type: 'html',
        content
      }))

      const positionedNodes = assignNodePositions(canvas, nodes)
      this.microcosm.api.create(positionedNodes)
    })
  }
}

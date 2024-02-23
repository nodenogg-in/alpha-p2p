import type { EditableMicrocosmAPI, MicrocosmAPI } from '../sync'
import type { Box, Vec2 } from '../schema'
import type { CanvasState } from './state'
import { DEFAULT_TOOL } from './constants'
import { Tool } from './tools'
import { State, parseFileToHTMLString } from '../utils'
import { defaultBox, defaultVec2 } from '../schema'
import { getSelectionBox, screenToCanvas } from './interaction'
import { CanvasInteraction } from './CanvasInteraction'
import { PointerState } from '../app'
import { isString } from 'lib0/function'
import { assignNodePositions } from './layout'

type ActionsState = {
  tool: Tool
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

type ActionsEvents = {
  selection: SelectionState
  action: ActionsState
}

export class CanvasActions extends State<ActionsEvents> {
  api: EditableMicrocosmAPI

  constructor(api: EditableMicrocosmAPI) {
    super({
      initial: () => ({
        action: defaultActionsState(),
        selection: defaultSelectionState()
      })
    })
    this.api = api
  }

  setTool = (tool: Tool = Tool.Select) => {
    this.set('action', { tool })
  }

  isTool = (...tools: Tool[]): boolean => tools.includes(this.state.action.tool)

  start = (canvas: CanvasInteraction, { shiftKey }: PointerState) => {
    // const distance = touch ? pointer.state.touchDistance : undefined

    if (this.isTool(Tool.Select, Tool.Edit)) {
      const isSelection = this.state.selection.nodes.length > 0
      if (!isSelection) {
        this.set('action', {
          selectedNodes: [],
          editingNode: null,
          action: true
        })
      } else {
        if (
          this.state.action.selectedNodes.length === 1 &&
          this.state.selection.target === this.state.action.selectedNodes[0]
        ) {
          this.set('action', {
            editingNode: this.state.action.selectedNodes[0]
          })
        } else if (
          this.state.selection.target &&
          this.state.action.selectedNodes.length >= 1 &&
          !this.state.action.selectedNodes.includes(this.state.selection.target) &&
          shiftKey
        ) {
          this.set('action', {
            selectedNodes: [...this.state.action.selectedNodes, this.state.selection.target]
          })
        } else {
          this.set('action', {
            selectedNodes: this.state.selection.target ? [this.state.selection.target] : [],
            editingNode: null
          })
        }
      }
    } else {
      this.set('action', {
        action: true
      })
    }
  }

  finish = (api: CanvasInteraction, { shiftKey }: PointerState) => {
    if (this.isTool(Tool.Select)) {
      if (this.state.selection.nodes.length > 0) {
        this.set('action', {
          selectedNodes: [...this.state.selection.nodes]
        })
      }
    }
    this.set('action', {
      action: false
    })
    this.reset()
  }

  update = (api: CanvasInteraction, pointer: PointerState) => {
    if (pointer.active) {
      // if (pointer.pinching) {
      //   pinch(pointer.touchDistance)
      // } else {
      if (this.isTool(Tool.Select)) {
        if (this.state.action.action) {
          this.set('selection', this.getSelection(api.get('canvas'), pointer))
        }
      }
      if (this.isTool(Tool.Move) && this.state.action.action) {
        api.move(pointer.delta)
      }
      if (this.isTool(Tool.New) && this.state.action.action) {
        this.set('selection', this.getSelection(api.get('canvas'), pointer))
      }
    }
  }

  resetSelection = () => {
    this.set('selection', defaultSelectionState())
  }

  reset = () => {
    this.resetSelection()
  }

  getSelection = (canvas: CanvasState, { delta, origin, point }: PointerState): SelectionState => {
    const box = getSelectionBox(origin, delta)

    const selection = this.api.intersect(screenToCanvas(canvas, point), screenToCanvas(canvas, box))

    return {
      box,
      point,
      ...selection
    }
  }
  handleDropFiles = async (canvas: CanvasState, files: File[]) => {
    const results = await Promise.all(files.map(parseFileToHTMLString))

    const filesHTML = results.filter(isString)

    const nodes = filesHTML.map((content) => ({
      type: 'html',
      content
    }))

    const positionedNodes = assignNodePositions(canvas, nodes)
    this.api.create(positionedNodes)
  }
}

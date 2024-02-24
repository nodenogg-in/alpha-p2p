import type { EditableMicrocosm } from '../sync'
import type { Box, Vec2 } from '../schema'
import type { CanvasState } from './CanvasInteractionState'
import { DEFAULT_TOOL, MINIMUM_NODE_SIZE } from './constants'
import { Tool } from './tools'
import { State, parseFileToHTMLString } from '../utils'
import { defaultBox, defaultVec2 } from '../schema'
import { getSelectionBox, screenToCanvas } from './interaction'
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
  microcosm: EditableMicrocosm

  constructor(microcosm: EditableMicrocosm) {
    super({
      initial: () => ({
        action: defaultActionsState(),
        selection: defaultSelectionState()
      })
    })
    this.microcosm = microcosm
  }

  setTool = (tool: Tool = Tool.Select) => {
    this.set('action', { tool })
  }

  public isTool = (...tools: Tool[]): boolean => tools.includes(this.state.action.tool)

  public start = ({ shiftKey }: PointerState) => {
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
    this.microcosm.canvas.storeState()
  }

  public finish = ({ shiftKey }: PointerState) => {
    if (this.isTool(Tool.New)) {
      const node = this.microcosm.canvas.screenToCanvas(this.get('selection').box)
      if (node.width > MINIMUM_NODE_SIZE.width && node.height > MINIMUM_NODE_SIZE.height) {
        this.microcosm.api.create({
          type: 'html',
          content: '',
          ...node
        })
      }
    }

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
    this.microcosm.canvas.storeState()
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

    if (!this.isTool(Tool.Move) && delta.y % 1 === 0) {
      this.microcosm.canvas.pan(delta)
    } else {
      this.microcosm.canvas.scroll(point, delta)
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

  public update = (pointer: PointerState) => {
    if (pointer.active) {
      // if (pointer.pinching) {
      //   pinch(pointer.touchDistance)
      // } else {
      if (this.isTool(Tool.Select)) {
        if (this.state.action.action) {
          this.set('selection', this.getSelection(pointer))
        }
      }
      if (this.isTool(Tool.Move) && this.state.action.action) {
        this.microcosm.canvas.move(pointer.delta)
      }
      if (this.isTool(Tool.New) && this.state.action.action) {
        this.set('selection', this.getSelection(pointer))
      }
    }
  }

  public onDropFiles = (files: File[] | null) => {
    if (!files) {
      return
    }
    const canvas = this.microcosm.canvas.get('canvas')

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

  resetSelection = () => {
    this.set('selection', defaultSelectionState())
  }

  reset = () => {
    this.resetSelection()
  }

  getSelection = ({ delta, origin, point }: PointerState): SelectionState => {
    const canvas = this.microcosm.canvas.get('canvas')
    const box = getSelectionBox(origin, delta)

    const selection = this.microcosm.api.intersect(
      screenToCanvas(canvas, point),
      screenToCanvas(canvas, box)
    )

    return {
      box,
      point,
      ...selection
    }
  }
}

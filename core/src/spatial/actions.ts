import { DEFAULT_TOOL } from './constants'
import { Tool } from './tools'
import { MicrocosmAPI } from '../sync'
import { Emitter, assign } from '../utils'
import { Box, Vec2, defaultBox, defaultVec2 } from '../schema/spatial.schema'
import { PointerState } from '../ui/Pointer'
import { CanvasState } from './state'
import { getSelectionBox, interact } from './interaction'

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

type ActionData = {
  shiftKey?: boolean
}

type ActionsEvents = {
  selection: SelectionState
  state: ActionsState
}

export class Actions extends Emitter<ActionsEvents> {
  state = defaultActionsState()
  selection = defaultSelectionState()
  api: MicrocosmAPI
  editing: boolean = false
  editingNode: string = null

  constructor(api: MicrocosmAPI) {
    super()
    console.log('actions constructor')
    this.api = api
  }

  setEditing = (editing?: string) => {
    this.editing = !!editing
    this.editingNode = this.editing ? this.selection.target : null
  }

  private set = <K extends keyof ActionsEvents>(key: K, value?: Partial<ActionsEvents[K]>) => {
    if (value) assign(this[key], value)
    this.emit(key, this[key])
    return value
  }

  isTool = (...tools: Tool[]): boolean => tools.includes(this.state.tool)

  start = ({ shiftKey }: ActionData) => {
    console.log('startAction')
  }
  finish = ({ shiftKey }: ActionData) => {
    console.log('startAction')
  }
  update = (canvas: CanvasState, pointer: PointerState) => {
    this.set('selection', this.getSelection(canvas, pointer))
  }

  resetSelection = () => {
    this.set('selection', defaultSelectionState())
  }

  reset = () => {
    this.resetSelection()
  }

  getSelection = (canvas: CanvasState, { delta, origin, point }: PointerState): SelectionState => {
    const box = getSelectionBox(origin, delta)

    const selection = this.api.intersect(
      interact.screenToCanvas(canvas, point),
      interact.screenToCanvas(canvas, box)
    )

    return {
      box,
      point,
      ...selection
    }
  }
}

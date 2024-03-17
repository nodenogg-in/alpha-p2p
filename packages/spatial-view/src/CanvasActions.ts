import { Box, CanvasScreen, Vec2, BoxReference, defaultBox, defaultVec2 } from './schema'
import { Signal, State, derive } from '@nodenogg.in/state'
import { DEFAULT_TOOL } from './constants'
import { ToolName } from './tools'
import { BoxEdgeProximity, getBoxEdgeProximity, scaleVec2 } from './geometry'
import { Canvas } from './Canvas'
import { calculateBoundingBox, intersectBoxWithPoint } from './intersection'
import { PointerState } from './pointer.schema'

type ActionState =
  | 'none'
  | 'draw-highlight'
  | 'move-selection'
  | 'resize-selection'
  | 'edit-selection'
  | 'draw-box'
  | 'move-canvas'

export type CanvasActionsState = {
  tool: ToolName
  state: ActionState
  edge: BoxEdgeProximity
  selection: {
    boxes: string[]
    target: string | null
  }
  highlight: {
    box: CanvasScreen<Box>
    point: CanvasScreen<Vec2>
  }
}

export type HighlightState = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vec2>
}

const defaultCanvasActionsState = (): CanvasActionsState => ({
  tool: DEFAULT_TOOL,
  state: 'none',
  edge: 'none',
  selection: {
    boxes: [],
    target: null
  },
  highlight: {
    box: {
      screen: defaultBox(),
      canvas: defaultBox()
    },
    point: {
      screen: defaultVec2(),
      canvas: defaultVec2()
    }
  }
})

const createGroupFromBoxes = (box_ids: string[], references: BoxReference[]): Box => {
  const boxes: Box[] = []

  for (const id of box_ids) {
    const box = references.find(([n_id]) => n_id === id)
    if (box) {
      boxes.push(box[1])
    }
  }

  return boxes.length > 0 ? calculateBoundingBox(boxes) : defaultBox()
}

type SelectionBox = CanvasScreen<Box>

export class CanvasActions<C extends Canvas> extends State<CanvasActionsState> {
  public selectionGroup: Signal<SelectionBox>

  constructor(protected canvas: C) {
    super({
      initial: defaultCanvasActionsState,
      throttle: 8
    })

    this.selectionGroup = derive(
      [this, this.canvas.api, this.canvas.interaction],
      ([{ selection }]) => {
        const canvas = createGroupFromBoxes(selection.boxes, this.canvas.api.boxes())
        return {
          canvas,
          screen: this.canvas.interaction.canvasToScreen(canvas)
        }
      }
    )
  }
  public reset = () => {
    this.set({
      ...this.initial()
    })
  }
  public is = (state: ActionState) => this.key('state').get() === state

  public rest = () => {
    this.key('edge').set('none')
  }
  public start = (ps: PointerState) => {
    // const distance = touch ? pointer.state.touchDistance : undefined
    this.key('highlight').set(this.canvas.interaction.getHighlight(ps))
    const selection = this.canvas.interaction.getSelection(
      this.key('highlight').get(),
      this.canvas.api.boxes()
    )

    const { point } = this.key('highlight').get()
    const group = this.selectionGroup.get()
    const action = this.get()

    if (this.canvas.isTool('select')) {
      // If a selection already exists, check if the point intersects the selection
      const intersectsSelection =
        selection.boxes.length > 0 && intersectBoxWithPoint(point.canvas, group.canvas, 10)

      if (intersectsSelection) {
        const edge = getBoxEdgeProximity(point.canvas, this.selectionGroup.get().canvas, 10)
        this.key('edge').set(edge)

        this.set({
          state: edge === 'none' ? 'move-selection' : 'resize-selection'
        })
      } else {
        this.set({
          selection: {
            boxes: [],
            target: null
          },
          edge: 'none',
          state: 'draw-highlight'
        })
      }
    } else if (this.canvas.isTool('move')) {
      this.set({
        state: 'move-canvas'
      })
    } else if (this.canvas.isTool('new')) {
      this.set({
        state: 'draw-box'
      })
    }

    this.canvas.interaction.storeState()
  }

  public update = (pointer: PointerState) => {
    if (this.is('move-canvas')) {
      this.canvas.interaction.move(pointer.delta)
      return
    }

    if (this.is('none')) {
      const highlight = this.canvas.interaction.getHighlight(pointer)
      const selection = this.canvas.interaction.getSelection(highlight, this.canvas.api.boxes(), 10)
      this.key('highlight').set(highlight)
      this.key('selection').set(selection)
      const intersectsSelection =
        selection.boxes.length > 0 &&
        intersectBoxWithPoint(highlight.point.canvas, this.selectionGroup.get().canvas, 10)

      this.key('edge').set(
        intersectsSelection
          ? getBoxEdgeProximity(highlight.point.canvas, this.selectionGroup.get().canvas, 10)
          : 'none'
      )

      // this.selection.set(this.getSelection(pointer))
    } else if (this.is('draw-highlight')) {
      this.key('highlight').set(this.canvas.interaction.getHighlight(pointer))
      const selection = this.canvas.interaction.getSelection(
        this.key('highlight').get(),
        this.canvas.api.boxes(),
        10
      )
      this.key('selection').set(selection)
    } else if (this.is('move-canvas')) {
      // console.log('move canvas')
      // this.interaction.move(pointer.delta)
    } else if (this.is('move-selection')) {
      const delta = scaleVec2(
        pointer.delta,
        1 / this.canvas.interaction.key('transform').get().scale
      )
      // this.canvas.Microcosm.move(this.getKey('selection').boxes, delta)
    } else if (this.is('resize-selection')) {
      const delta = scaleVec2(
        pointer.delta,
        1 / this.canvas.interaction.key('transform').get().scale
      )
      // this.canvas.Microcosm.resize(
      //   this.selectionGroup.get().canvas,
      //   this.getKey('selection').boxes,
      //   delta,
      //   this.getKey('edge')
      // )
    }
  }

  public finish = (pointer: PointerState) => {
    this.set({ state: 'none', edge: 'none', selection: { boxes: [], target: null } })
    console.log('finish!!')

    this.canvas.interaction.storeState()
  }
}

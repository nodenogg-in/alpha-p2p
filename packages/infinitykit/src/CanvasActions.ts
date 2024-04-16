import { type Signal, State, createEvents, machine, signal } from '@figureland/statekit'
import vector2, { type Vector2 } from '@figureland/mathkit/vector2'
import box, { type Box } from '@figureland/mathkit/box'

import { type CanvasScreen, type BoxReference } from './schema/spatial.schema'
import { DEFAULT_TOOL } from './constants'
import { type BoxEdgeProximity, getBoxEdgeProximity } from './utils/geometry'
import { type API, InfinityKit } from './InfinityKit'
import { calculateBoundingBox, intersectBoxWithPoint } from './utils/intersection'
import { type PointerState } from './schema/pointer.schema'
import { type ToolSet } from '.'

const createStateMachine = () =>
  machine(
    'idle',
    {
      idle: {
        on: {
          brush: 'brushing',
          move: 'moving',
          resize: 'resizing',
          'draw-node': 'drawing-node',
          'draw-region': 'drawing-region'
        }
      },
      brushing: {
        on: {
          finish: 'idle'
        }
      },
      moving: {
        on: {
          finish: 'idle'
        }
      },
      resizing: {
        on: {
          finish: 'idle'
        }
      },
      'drawing-node': {
        on: {
          finish: 'idle'
        }
      },
      'drawing-region': {
        on: {
          finish: 'idle'
        }
      }
    },
    () => ({ x: 1, y: 2 })
  )

type ActionState =
  | 'none'
  | 'draw-highlight'
  | 'move-selection'
  | 'resize-selection'
  | 'edit-selection'
  | 'draw-box'
  | 'move-canvas'

export type CanvasActionsState = {
  tool: string
  state: ActionState
  edge: BoxEdgeProximity
  selection: {
    boxes: string[]
    target: string | null
  }
  highlight: {
    box: CanvasScreen<Box>
    point: CanvasScreen<Vector2>
  }
}

export type HighlightState = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vector2>
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
      screen: box(),
      canvas: box()
    },
    point: {
      screen: vector2(),
      canvas: vector2()
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

  return boxes.length > 0 ? calculateBoundingBox(boxes) : box()
}

type SelectionBox = CanvasScreen<Box>

export type InfinityKitEvents = {
  create: Box[]
}

export class CanvasActions<
  T extends ToolSet,
  C extends InfinityKit<A, T>,
  A extends API = API
> extends State<CanvasActionsState> {
  public selectionGroup: Signal<SelectionBox>
  public events = createEvents<InfinityKitEvents>()
  public machine = createStateMachine()

  constructor(protected kit: C) {
    super({
      initial: defaultCanvasActionsState,
      throttle: 8
    })

    this.selectionGroup = signal((get) => {
      const selection = get(this.key('selection'))
      get(this.kit.interaction)
      const canvas = createGroupFromBoxes(selection.boxes, this.kit.api.boxes())
      return {
        canvas,
        screen: this.kit.interaction.canvasToScreen(canvas)
      }
    })

    this.use(this.selectionGroup.dispose)
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
    this.key('highlight').set(this.kit.interaction.getHighlight(ps))
    const selection = this.kit.interaction.getSelection(
      this.key('highlight').get(),
      this.kit.api.boxes()
    )

    if (this.machine.is('idle')) {
      this.machine.send('brush')
    }

    const { point } = this.key('highlight').get()
    const group = this.selectionGroup.get()
    // const action = this.get()

    if (this.kit.isTool('select')) {
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
    } else if (this.kit.isTool('move')) {
      this.set({
        state: 'move-canvas'
      })
    } else if (this.kit.isTool('new')) {
      this.set({
        state: 'draw-box'
      })
    }

    this.kit.interaction.storeState()
  }

  public update = (pointer: PointerState) => {
    // if (this.machine.is('idle')) {
    //   return
    // } else if (this.machine.is('brushing')) {
    //   this.machine.send('brush', { x: 0 })
    // }
    // if (this.is('move-canvas')) {
    //   this.kit.interaction.move(pointer.delta)
    //   return
    // }

    if (this.is('none')) {
      const highlight = this.kit.interaction.getHighlight(pointer)
      const selection = this.kit.interaction.getSelection(highlight, this.kit.api.boxes(), 10)
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
      this.key('highlight').set(this.kit.interaction.getHighlight(pointer))
      const selection = this.kit.interaction.getSelection(
        this.key('highlight').get(),
        this.kit.api.boxes(),
        10
      )
      this.key('selection').set(selection)
    } else if (this.is('move-canvas')) {
      // console.log('move canvas')
      this.kit.interaction.move(pointer.delta)
    } else if (this.is('move-selection')) {
      // const delta = scalePoint(pointer.delta, 1 / this.kit.interaction.key('transform').get().scale)
      // this.kit.Microcosm.move(this.getKey('selection').boxes, delta)
    } else if (this.is('resize-selection')) {
      // const delta = scalePoint(pointer.delta, 1 / this.kit.interaction.key('transform').get().scale)
      // this.kit.Microcosm.resize(
      //   this.selectionGroup.get().canvas,
      //   this.getKey('selection').boxes,
      //   delta,
      //   this.getKey('edge')
      // )
    }
  }

  public finish = (_pointer: PointerState) => {
    this.set({ state: 'none', edge: 'none', selection: { boxes: [], target: null } })
    console.log('finish!!')

    this.kit.interaction.storeState()
  }
}

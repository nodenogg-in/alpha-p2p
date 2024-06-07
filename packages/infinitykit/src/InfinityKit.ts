import { type Signal, signal, Manager } from '@figureland/statekit'
import type { PointerState } from '@figureland/toolkit'
import type { Box, Vector2 } from '@figureland/mathkit/box'
import { type CanvasOptions, Canvas } from './Canvas'
import type { PersistenceName } from '@figureland/statekit/typed-local-storage'
import type { InferQueryID, QueryAPI } from './query/query-api'
import { type DefaultTools, defaultTools } from './default-tools'

export type IKActionType = {
  type: string
  state: any
}

export type IKActions =
  | {
      type: 'idle'
      state: null
    }
  | {
      type: 'select'
      state: Box
    }
  | {
      type: 'pan'
      state: Vector2
    }
  | {
      type: 'draw'
      state: [Box, Vector2[]]
    }
  | {
      type: 'move'
      state: Vector2
    }
  | {
      type: 'resize'
      state: Box
    }

export type IKState<ID extends string = string> = {
  selection: ID[]
}

export class InfinityKit<API extends QueryAPI = QueryAPI> extends Manager {
  public readonly canvas: Canvas
  public tools: Signal<DefaultTools>
  public tool: Signal<keyof DefaultTools>
  public state: Signal<IKState>
  public visible: Signal<InferQueryID<API>[]>

  constructor(
    public api: API,
    {
      initialCanvasState,
      persistence
    }: {
      initialCanvasState?: Partial<CanvasOptions>
      persistence?: PersistenceName
    }
  ) {
    super()
    this.tool = this.use(signal<keyof DefaultTools>(() => 'select'))
    this.tools = this.use(signal(() => defaultTools))
    this.state = this.use(
      signal<IKState>(() => ({
        selection: []
      }))
    )

    this.canvas = this.use(
      new Canvas({
        options: initialCanvasState,
        persistence
      })
    )
    this.visible = this.use(
      api.signalQuery(
        Symbol(),
        signal((get) => ({
          target: get(this.canvas.canvasViewport)
        }))
      )
    )
  }

  public setTool = (tool: keyof DefaultTools) => {
    if (tool !== this.tool.get()) {
      this.onDeselect()
      this.tool.set(tool)
      this.onSelect()
    }
  }

  public getActiveTool = () => this.tools.get()[this.tool.get()]

  public onFocus = () => {}

  public onBlur = () => {}

  public wheel: Canvas['wheel'] = (point, delta) => {
    this.canvas.wheel(point, delta)
  }

  public onPointerDown = (p: PointerState) => {
    const action = this.getActiveTool().onPointerDown?.(this, p)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public onPointerMove = (p: PointerState) => {
    const action = this.getActiveTool().onPointerMove?.(this, p)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public onPointerUp = (p: PointerState) => {
    const action = this.getActiveTool().onPointerUp?.(this, p)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public onWheel = (p: PointerState) => {
    const action = this.getActiveTool().onWheel?.(this, p)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public onSelect = () => {
    const action = this.getActiveTool().onSelect?.(this)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public onDeselect = () => {
    const action = this.getActiveTool().onDeselect?.(this)
    if (action) {
      this.handleToolAction(action)
    }
  }

  public handleToolAction = (action: IKActions) => {
    switch (action.type) {
      case 'idle':
        console.log('cm:idle')
        break
      case 'select':
        console.log('cm:select')
        break
      case 'pan':
        console.log('cm:move-canvas')
        break
      case 'draw':
        console.log('cm:draw-entity')
        break
      case 'move':
        console.log('cm:move-entity')
        break
      case 'resize':
        console.log('cm:resize-entity')
        break
      default:
        console.log('Unknown action type')
    }
  }
}

// type CanvasManagerState<ID extends string = string> = {
//   selection: ID[]
// }

// type CanvasManagerConstructor = {
//   initialCanvasState?: Partial<CanvasOptions>
//   persistence?: PersistenceName
// }

// export class CanvasManager<API extends QueryAPI> extends BaseCanvasManager<typeof defaultTools> {
//   constructor(
//     private api: API,
//     { persistence, initialCanvasState }: CanvasManagerConstructor
//   ) {
//     super({
//       tools: defaultTools,
//       initialTool: 'select',
//       persistence,
//       initialCanvasState,
//       state: (): CanvasManagerState => ({
//         selection: []
//       })
//     })
//   }
// }

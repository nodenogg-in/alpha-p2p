import { system, signalObject } from '@figureland/statekit'
import type { Canvas } from './Canvas'
import type { ToolSet } from './tools'
import { entries } from '@figureland/typekit'
import { PointerState } from '@figureland/toolkit/pointer'

type CanvasActionsState = {
  tool: string
  state: 'none' | 'selecting'
  focus: boolean
  hover: boolean
}

const defaultActionsState = (): CanvasActionsState => ({
  tool: 'select',
  state: 'none',
  focus: false,
  hover: false
})

export class Actions<
  T extends ToolSet = ToolSet,
  C extends Canvas = Canvas,
  TL extends [keyof T, T[keyof T]][] = [keyof T, T[keyof T]][]
> {
  private system = system()
  public readonly state = this.system.use(signalObject<CanvasActionsState>(defaultActionsState()))
  public readonly toolbar: TL

  constructor(
    private readonly tools: T,
    private readonly canvas: C
  ) {
    this.toolbar = entries(this.tools).filter(([_, tool]) => !tool.hidden) as TL
  }

  public hasTool = (tool: keyof T) => !!this.tools[tool]

  public setTool = (tool: keyof T) => {
    if (this.hasTool(tool)) {
      this.state.set({ tool: (tool as string) || 'select' })
    }
  }

  public isTool = (...tools: (keyof T)[]): boolean => tools.includes(this.state.key('tool').get())

  public start = (pointer: PointerState) => {
    console.log('pointer down')
  }

  public update = (pointer: PointerState) => {
    if (!this.state.key('focus').get()) {
      return
    }
    console.log('pointer move')
  }

  public finish = (pointer: PointerState) => {
    console.log('pointer up')
  }

  public blur = () => {
    this.state.set({ focus: false })
  }

  public focus = () => {
    this.state.set({ focus: true })
  }

  public wheel: Canvas['wheel'] = (point, delta) => {
    this.canvas.wheel(point, delta)
  }
  public reset = () => this.state.set(defaultActionsState)

  public dispose = () => this.system.dispose()
}

import { manager, signalObject } from '@figureland/statekit'
import type { Canvas } from './Canvas'
import type { ToolSet } from './tools'
import { entries } from '@figureland/typekit'
import { Vector2 } from '@figureland/mathkit'
import { PointerState } from '@figureland/toolkit/pointer'

type CanvasActionsState = {
  tool: string
  state: 'none' | 'selecting'
  focused: boolean
}
const defaultActionsState = (): CanvasActionsState => ({
  tool: 'select',
  state: 'none',
  focused: false
})

export class Actions<
  T extends ToolSet,
  TL extends [keyof T, T[keyof T]][] = [keyof T, T[keyof T]][]
> {
  private manager = manager()
  public readonly state = this.manager.use(signalObject<CanvasActionsState>(defaultActionsState()))
  public readonly toolbar: [keyof T, T[keyof T]][]

  constructor(
    private readonly api: any,
    private readonly tools: T,
    private readonly canvas: Canvas
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

  public down = (pointer: PointerState) => {
    console.log('pointer down')
  }

  public move = (pointer: PointerState) => {
    console.log('pointer move')
    if (!this.state.key('focused').get()) {
      return
    }
  }

  public up = (pointer: PointerState) => {
    console.log('pointer up')
  }

  public wheel = (point: Vector2, delta: Vector2) => {
    console.log('wheel')
    if (delta.y % 1 === 0) {
      this.canvas.pan(delta)
    } else {
      this.canvas.scroll(point, delta)
    }
  }

  public out = () => {
    console.log('pointer out')
    this.state.set({ focused: true })
  }

  public over = () => {
    console.log('pointer over')
    this.state.set({ focused: false })
  }

  public focus = () => {
    console.log('focus')
    this.state.set({ focused: true })
  }

  public reset = () => this.state.set(defaultActionsState)

  public dispose = this.manager.dispose
}

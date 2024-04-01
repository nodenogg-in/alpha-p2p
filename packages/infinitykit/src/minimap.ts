import { clamp } from '@nodenogg.in/toolkit'
import type { BoxReference, Box } from './schema/spatial.schema'
import { type CanvasInteractionState } from '.'
import { calculateBoundingBox } from './utils/intersection'

type RenderOptions = {
  width?: number
  height?: number
  nodeColor?: string
  dp?: number
}

type CanvasElement = HTMLCanvasElement | OffscreenCanvas

export class MinimapRenderer {
  private canvas: OffscreenCanvas
  private ctx: OffscreenCanvasRenderingContext2D | null
  private width: number = 500
  private height: number = 500
  private dp: number = 1
  private nodeColor: string = 'black'

  constructor(options: RenderOptions) {
    this.update(options)
    this.canvas = new OffscreenCanvas(this.width * this.dp, this.height * this.dp)
    this.ctx = this.canvas.getContext('2d')
  }

  public update = (u: Partial<RenderOptions>) => {
    this.dp = clamp(u.dp || window.devicePixelRatio, 1, 3)
    this.width = u.width || this.width
    this.height = u.height || this.height
    if (u.nodeColor) this.nodeColor = u.nodeColor
  }

  public render = (nodes: BoxReference[], state: CanvasInteractionState) => {
    if (!this.ctx) {
      return
    }

    const { width, height, dp, ctx } = this
    ctx.clearRect(0, 0, width * dp, height * dp)
    ctx.fillStyle = this.nodeColor
    ctx.strokeStyle = this.nodeColor
    ctx.globalAlpha = 1.0

    // const box = screenToCanvas(state, state.viewport)
    const box = {
      x: state.transform.translate.x,
      y: state.transform.translate.y,
      width: state.viewport.width / state.transform.scale,
      height: state.viewport.height / state.transform.scale
    }
    const totalBounds = calculateBoundingBox([...nodes, box])

    const scale = fitWithinContainer(this.canvas, totalBounds)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)

    for (const [, node] of nodes) {
      ctx.rect(node.x, node.y, node.width, node.height)
    }

    ctx.fill()
    ctx.lineWidth = 10
    ctx.save()
    ctx.strokeStyle = 'red'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.strokeRect(0, 0, box.width, box.height)
    ctx.restore()
  }

  public renderToCanvas = (element: HTMLCanvasElement) => {
    const ctx = element.getContext('2d')
    if (!ctx) {
      return
    }
    element.width = this.width * this.dp
    element.height = this.height * this.dp
    ctx.clearRect(0, 0, element.width, element.height)
    element.style.width = `${this.width}px`
    element.style.height = `${this.height}px`
    ctx.drawImage(this.canvas, 0, 0, this.width * this.dp, this.height * this.dp)
  }
}

const fitWithinContainer = (element: CanvasElement, bounds: Box) => {
  const { width, height } = bounds
  const aspect = width / height
  const containerAspect = element.width / element.height

  let scale = 1

  if (aspect > containerAspect) {
    scale = element.width / width
  } else {
    scale = element.height / height
  }

  return scale
}

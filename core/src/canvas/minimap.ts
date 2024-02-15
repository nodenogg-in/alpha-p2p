import { NodeReference } from '../sync'
import { CanvasState } from './interaction'
import { clamp } from './number'
import { calculateBoundingBox } from './intersection'
import { Box } from './schema'

type RenderOptions = {
  width?: number
  height?: number
  color?: string
  dp?: number
}

export const renderMinimapToCanvas = (
  element: HTMLCanvasElement,
  canvas: CanvasState,
  nodes: NodeReference[],
  options: RenderOptions = {},
  viewport: Box
) => {
  const ctx = element.getContext('2d')
  if (!ctx) return

  const {
    width = 500,
    height = 500,
    color = 'yellow',
    dp = clamp(window.devicePixelRatio, 1, 3)
  } = options

  element.width = width * dp
  element.height = height * dp
  element.style.width = `${200}px`
  element.style.height = `${200}px`

  ctx.clearRect(0, 0, width * dp, height * dp)
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.globalAlpha = 1.0

  const totalBounds = calculateBoundingBox([
    ...nodes,
    viewport
    // { ...canvas.container, ...canvas.transform.translate }
  ])

  for (const [, node] of nodes) {
    ctx.rect(node.x, node.y, node.width, node.height)
  }

  ctx.fill()
  ctx.lineWidth = 10
  ctx.save()
  ctx.strokeStyle = 'red'
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.strokeRect(0, 0, viewport.width, viewport.height)
  ctx.restore()
}

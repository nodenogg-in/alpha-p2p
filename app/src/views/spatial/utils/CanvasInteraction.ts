import type { Box, Point } from '@/views/spatial'
import CanvasInteractionWorker from './CanvasInteraction.worker?worker'
import type { BoxReference, NodeSelection } from './intersection'

export type IntersectionData = {
  point: string | null
  selection: NodeSelection
}

export class CanvasInteraction {
  private worker = new CanvasInteractionWorker()

  public setBoxes = (nodes: BoxReference[]): Promise<void> => this.send('setBoxes', nodes)

  public intersect = (point: Point, box: Box): Promise<IntersectionData> =>
    this.send('intersect', [point, box])

  private send = (method: string, args: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'))
        return
      }

      this.worker.postMessage({ method, args })
      this.worker.onmessage = (event) => {
        resolve(event.data)
      }
      this.worker.onerror = (event) => {
        reject(event)
      }
    })
  }
}

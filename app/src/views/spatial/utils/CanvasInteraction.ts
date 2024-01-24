import type { API, Intersect, SetBoxes } from './canvas-interaction.worker'
import CanvasInteractionWorker from './canvas-interaction.worker?worker'

export class CanvasInteraction {
  private worker = new CanvasInteractionWorker()

  public setBoxes: API<SetBoxes> = (nodes) => {
    return this.send('setBoxes', nodes)
  }

  public intersect: API<Intersect> = (data) => {
    return this.send('intersect', data)
  }

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

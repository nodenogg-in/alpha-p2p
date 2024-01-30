import type { Box, Point } from './spatial.types'
import IntersectionsWorker from './Intersections.worker?worker'
import type { BoxReference, BoxSelection } from './intersection'

export type IntersectionData = {
  point: string | null
  selection: BoxSelection
}

export const createIntersectionManager = () => {
  const worker = new IntersectionsWorker()

  const send = (method: string, args: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        reject(new Error('Worker not initialized'))
        return
      }

      worker.postMessage({ method, args })
      worker.onmessage = (event) => {
        resolve(event.data)
      }
      worker.onerror = (event) => {
        reject(event)
      }
    })
  }

  return {
    update: (nodes: BoxReference[]): Promise<void> => send('setBoxes', nodes),
    intersect: (point: Point, box: Box): Promise<IntersectionData> =>
      send('intersect', [point, box])
  }
}

export type IntersectionManager = ReturnType<typeof createIntersectionManager>

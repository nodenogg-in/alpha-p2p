import { lastInArray } from '@/utils'
import type { Box, Point } from '../SpatialView.types'
import { intersectPoint, type BoxReference, intersectBox, type NodeSelection } from './intersection'

class CanvasInteraction {
  private boxes: BoxReference[] = []

  public setBoxes = (boxes: BoxReference[]) => {
    this.boxes = [...boxes]
  }

  public intersect = ([point, [box, overlapRatio]]: [Point, [Box, number]]) => ({
    point: lastInArray(intersectPoint(point, this.boxes)),
    selection: intersectBox(box, this.boxes, overlapRatio)
  })
}

export type SetBoxes = {
  method: 'setBoxes'
  args: BoxReference[]
  returns: void
}

export type Intersect = {
  method: 'intersect'
  args: [Point, [Box, number]]
  returns: IntersectionData
}

export type IntersectionData = {
  point: string | null
  selection: NodeSelection
}

export type Method = SetBoxes | Intersect

export type API<M extends Method> = (m: M['args']) => Promise<M['returns']>

const instance = new CanvasInteraction()

interface InteractionMessageEvent extends MessageEvent {
  data: Method
}

self.addEventListener('message', (event: InteractionMessageEvent) => {
  const { method, args } = event.data
  const result = (instance as any)[method](args)
  ;(self as any).postMessage(result)
})

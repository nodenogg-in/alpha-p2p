import { lastInArray } from '@/utils'
import type { Box, Point } from '@/microcosm/spatial/spatial.types'
import { intersectPoint, type BoxReference, intersectBox } from './intersection'

class Intersections {
  private boxes: BoxReference[] = []

  public setBoxes = (boxes: BoxReference[]) => {
    this.boxes = [...boxes]
  }

  public intersect = ([point, box]: [Point, Box]) => ({
    point: lastInArray(intersectPoint(point, this.boxes)),
    selection: intersectBox(box, this.boxes)
  })
}

const instance = new Intersections()

interface InteractionMessageEvent extends MessageEvent {}

self.addEventListener('message', (event: InteractionMessageEvent) => {
  const { method, args } = event.data
  const result = (instance as any)[method](args)
  ;(self as any).postMessage(result)
})

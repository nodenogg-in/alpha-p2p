import { lastInArray } from '../utils/misc'
import type { Box, Point, BoxReference, IntersectionResult } from './schema'
import { intersectBox, intersectPoint } from './intersection'

export class IntersectionManager {
  boxes: BoxReference[] = []

  update = async (n: BoxReference[]): Promise<void> => {
    this.boxes = [...n]
  }
  intersect = async (point: Point, box: Box): Promise<IntersectionResult> => ({
    point: lastInArray(intersectPoint(point, this.boxes)),
    selection: intersectBox(box, this.boxes)
  })
}

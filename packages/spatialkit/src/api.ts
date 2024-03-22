import type { Box, BoxReference } from './schema'
import type { State } from '@nodenogg.in/smallstate'

export interface CanvasAPI extends State<any> {
  boxes: () => BoxReference[]
  isActive: () => boolean
}

export interface EditableCanvasAPI extends CanvasAPI {
  create: (boxes: Box[]) => void
}

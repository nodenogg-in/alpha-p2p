import type { Box, BoxReference } from './schema'
import type { Canvas } from '.'
import type { State } from '@nodenogg.in/state/*'

export interface CanvasAPI extends State<any> {
  boxes: () => BoxReference[]
  isActive: () => boolean
}

export interface EditableCanvasAPI extends CanvasAPI {
  create: (boxes: Box[]) => void
}

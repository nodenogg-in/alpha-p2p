import { type Box, type CanvasScreen, type Vec2, defaultBox, defaultVec2 } from '../../../schema'
import { State } from '../../../utils'

export type HighlightState = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vec2>
}

export class Highlight extends State<HighlightState> {
  constructor() {
    super({
      initial: () => ({
        point: {
          screen: defaultVec2(),
          canvas: defaultVec2()
        },
        box: {
          screen: defaultBox(),
          canvas: defaultBox()
        }
      }),
      throttle: 8
    })
  }
}

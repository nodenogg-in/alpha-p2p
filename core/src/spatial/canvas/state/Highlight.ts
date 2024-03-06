import { type Box, type CanvasScreen, type Vec2, defaultBox, defaultVec2 } from '../../../schema'
import { State } from '../../../utils'

export type Highlight = {
  box: CanvasScreen<Box>
  point: CanvasScreen<Vec2>
}

const defaultHighlightState = (): Highlight => ({
  point: {
    screen: defaultVec2(),
    canvas: defaultVec2()
  },
  box: {
    screen: defaultBox(),
    canvas: defaultBox()
  }
})

export class HighlightState extends State<Highlight> {
  constructor() {
    super({
      initial: defaultHighlightState,
      throttle: 8
    })
  }

  public reset = () => {
    this.set(defaultHighlightState())
  }
}

import move from './move.icon.svg?raw'
import drawNode from './drawNode.icon.svg?raw'
import select from './select.icon.svg?raw'
import connect from './connect.icon.svg?raw'
import chevron from './chevron.icon.svg?raw'
import stack from './stack.icon.svg?raw'
import close from './close.icon.svg?raw'
import menu from './menu.icon.svg?raw'
import newMicrocosm from './newMicrocosm.icon.svg?raw'
import ellipsis from './ellipsis-vertical.icon.svg?raw'
import pin from './pin.icon.svg?raw'
import tool from './tool.icon.svg?raw'
import plus from './plus.icon.svg?raw'
import drawRegion from './drawRegion.icon.svg?raw'

export type IconName = keyof typeof icons

export const icons = {
  move,
  drawNode,
  select,
  connect,
  chevron,
  stack,
  close,
  menu,
  ellipsis,
  pin,
  tool,
  newMicrocosm,
  plus,
  drawRegion
} as const

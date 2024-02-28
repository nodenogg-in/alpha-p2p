import move from './move.icon.svg?raw'
import newNode from './newNode.icon.svg?raw'
import select from './select.icon.svg?raw'
import connect from './connect.icon.svg?raw'
import chevron from './chevron.icon.svg?raw'
import stack from './stack.icon.svg?raw'
import close from './close.icon.svg?raw'

export type IconName = keyof typeof icons

export const icons = {
  move,
  new: newNode,
  select,
  connect,
  chevron,
  stack,
  close
} as const

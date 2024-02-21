import move from './move.icon.vue'
import newNode from './newNode.icon.vue'
import select from './select.icon.vue'
import connect from './connect.icon.vue'
import chevron from './chevron.icon.vue'
import stack from './stack.icon.vue'
import close from './close.icon.vue'

import * as keys from '.'

export type IconName = keyof typeof keys

export { move, newNode, select, connect, chevron, stack, close }

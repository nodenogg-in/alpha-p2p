export type Tool = {
  name: string
  command: string
  hidden?: boolean
}

export type ToolSet = Record<string, Tool>

export const moveTool = {
  name: 'Move',
  command: 'h'
} as const

export const selectTool = {
  name: 'Select',
  command: 'v'
} as const

export const newTool = {
  name: 'New',
  command: 'n'
} as const

export const connectTool = {
  name: 'Connect',
  command: 'c'
} as const

export const editTool = {
  name: 'Edit',
  command: 'e',
  hidden: true
} as const

export const defaultTools = {
  select: selectTool,
  move: moveTool,
  new: newTool,
  connect: connectTool,
  edit: editTool
}

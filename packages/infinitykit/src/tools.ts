export type Tool = {
  name: string
  command: string
  hidden?: boolean
  icon: string
}

export type ToolSet = Record<string, Tool>

export const moveTool = {
  name: 'Move',
  command: 'h',
  icon: 'move'
} as const

export const selectTool = {
  name: 'Select',
  command: 'v',
  icon: 'select'
} as const

export const drawNodeTool = {
  name: 'Add node',
  command: 'n',
  icon: 'drawNode'
} as const

export const drawRegionTool = {
  name: 'Add region',
  command: 'r',
  icon: 'drawRegion'
} as const

export const connectTool = {
  name: 'Connect',
  command: 'c',
  icon: 'connect'
} as const

export const editTool = {
  name: 'Edit',
  command: 'e',
  hidden: true,
  icon: 'edit'
} as const

export const defaultTools = {
  select: selectTool,
  move: moveTool,
  drawNode: drawNodeTool,
  drawRegion: drawRegionTool,
  connect: connectTool,
  edit: editTool
} as const

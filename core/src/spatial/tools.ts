export type ToolName = keyof typeof Tools

export type Tool = {
  name: string
  command: string
  hidden?: boolean
}

export const Tools = {
  move: {
    name: 'Move',
    command: 'h'
  },
  select: {
    name: 'Select',
    command: 'v'
  },
  new: {
    name: 'New',
    command: 'n'
  },
  connect: {
    name: 'Connect',
    command: 'c'
  },
  edit: {
    name: 'Edit',
    command: 'e',
    hidden: true
  }
} as const

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new',
  Connect = 'connect',
  Edit = 'edit'
}

export const isMoveTool = (mode: Tool): mode is Tool.Move => mode === Tool.Move
export const isSelectTool = (mode: Tool): mode is Tool.Select => mode === Tool.Select
export const isNewTool = (mode: Tool): mode is Tool.New => mode === Tool.New
export const isConnectTool = (mode: Tool): mode is Tool.Connect => mode === Tool.Connect
export const isEditTool = (mode: Tool): mode is Tool.Edit => mode === Tool.Edit

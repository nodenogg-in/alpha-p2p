import { entityTool } from './tools/entity-tool'
import { regionTool } from './tools/region-tool'
import { moveTool } from './tools/move-tool'
import { selectTool } from './tools/select-tool'

export const defaultTools = {
  select: selectTool(),
  move: moveTool(),
  entity: entityTool(),
  region: regionTool()
}

export type DefaultTools = typeof defaultTools

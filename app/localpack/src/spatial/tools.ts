import { enum_ } from 'valibot'

export enum Tool {
  Move = 'move',
  Select = 'select',
  New = 'new',
  Connect = 'connect',
  Edit = 'edit'
}

export const toolSchema = enum_(Tool)

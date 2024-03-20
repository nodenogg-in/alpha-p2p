import { type Output, picklist } from 'valibot'

export const viewNames = ['spatial', 'collect'] as const

export const viewName = picklist(viewNames)

export type ViewName = Output<typeof viewName>

export const DEFAULT_VIEW: ViewName = 'spatial'

import { type Output, picklist } from 'valibot'

export const viewTypes = ['spatial', 'collect'] as const

export const viewType = picklist(viewTypes)

export type ViewType = Output<typeof viewType>

export const DEFAULT_VIEW: ViewType = 'spatial'

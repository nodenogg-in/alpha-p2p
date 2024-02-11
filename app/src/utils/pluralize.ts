import { isNumber } from '@/core/utils/guards'

export const pluralize = (items: number | Map<unknown, unknown> | unknown[], name: string) => {
  let count: number

  if (isNumber(items)) {
    count = items
  } else {
    count = Array.isArray(items) ? items.length : items.size
  }

  return count === 1 ? `1 ${name}` : `${count} ${name}s`
}

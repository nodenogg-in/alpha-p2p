import type { Microcosm } from '@/types/schema'

export const groupMicrocosmsByNamespace = (microcosms: Map<string, Microcosm>) => {
  const nsMap = new Map<string, Microcosm[]>()
  nsMap.set('main', [])

  microcosms.forEach((microcosm) => {
    nsMap.get('main')?.push(microcosm)
  })

  return nsMap
}

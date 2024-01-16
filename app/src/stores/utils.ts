import type { Microcosm } from '@/types/schema'

export const groupMicrocosmsByNamespace = (microcosms: Map<string, Microcosm>) => {
  const nsMap = new Map<string, Microcosm[]>()

  microcosms.forEach((microcosm) => {
    const { namespace_id } = microcosm

    if (!nsMap.has(namespace_id)) {
      nsMap.set(namespace_id, [])
    }

    nsMap.get(namespace_id)?.push(microcosm)
  })

  return nsMap
}

// import { type NewMicrocosmSchema } from '@/microcosm/stores/use-demo-state'
import { is, object, string } from 'valibot'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const queryParamsSchema = object({
  with: string()
})

const parseQuery = (q: unknown): string[] => {
  if (is(queryParamsSchema, q)) {
    return q.with.split(',')
  } else {
    return []
  }
}

export const useRouteMicrocosms = () => {
  const route = useRoute()
  return computed(() => [
    Array.isArray(route.params.microcosm_uri)
      ? route.params.microcosm_uri.join('/')
      : route.params.microcosm_uri,
    ...parseQuery(route.query)
  ])
}

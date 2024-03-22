import { is, object, string } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidMicrocosmURI } from '@nodenogg.in/microcosm'
import { telemetry } from '@/state'

const queryParamsSchema = object({
  with: string()
})

const parseQuery = (q: unknown): string[] => {
  if (is(queryParamsSchema, q)) {
    const parts = q.with.split(',')
    return parts.filter(isValidMicrocosmURI)
  } else {
    return []
  }
}

export const paramToString = <T extends string>(param: string | string[]): T =>
  Array.isArray(param) ? (param.join('') as T) : (param as T)

export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()

  const handleRoute = () => {
    const microcosm_uri = route.params.microcosm_uri as string

    if (microcosm_uri && !isValidMicrocosmURI(paramToString(microcosm_uri))) {
      telemetry.log({
        name: 'useAppRouter',
        message: `${microcosm_uri} is not a valid Microcosm URI`,
        level: 'warn'
      })

      router.push({
        name: 'NotFound',
        query: {
          message: `${microcosm_uri} is not a valid Microcosm URI`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const microcosm_uri = paramToString(route.params.microcosm_uri)
    return {
      microcosm_uri: isValidMicrocosmURI(microcosm_uri) && microcosm_uri,
      subviews: parseQuery(route.query)
    }
  })
}

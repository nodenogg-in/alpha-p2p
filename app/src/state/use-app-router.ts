import { is, object, string } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidMicrocosmID, type MicrocosmID } from '@nodenogg.in/microcosm'
import { telemetry } from '.'

const queryParamsSchema = object({
  with: string()
})

const parseQuery = (q: unknown) => {
  if (is(queryParamsSchema, q)) {
    const parts = q.with.split(',')
    return parts.filter(isValidMicrocosmID) as MicrocosmID[]
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
    const microcosmID = route.params.microcosmID as string

    if (microcosmID && !isValidMicrocosmID(paramToString(microcosmID))) {
      telemetry.log({
        name: 'useAppRouter',
        message: `${microcosmID} is not a valid Microcosm ID`,
        level: 'warn'
      })

      router.push({
        name: 'NotFound',
        query: {
          message: `${microcosmID} is not a valid Microcosm ID`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const microcosmID = paramToString(route.params.microcosmID)
    return {
      microcosmID: isValidMicrocosmID(microcosmID) && (microcosmID as MicrocosmID),
      subviews: parseQuery(route.query)
    }
  })
}

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
    const MicrocosmID = route.params.MicrocosmID as string

    if (MicrocosmID && !isValidMicrocosmID(paramToString(MicrocosmID))) {
      telemetry.log({
        name: 'useAppRouter',
        message: `${MicrocosmID} is not a valid Microcosm ID`,
        level: 'warn'
      })

      router.push({
        name: 'NotFound',
        query: {
          message: `${MicrocosmID} is not a valid Microcosm ID`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const MicrocosmID = paramToString(route.params.MicrocosmID)
    return {
      MicrocosmID: isValidMicrocosmID(MicrocosmID) && (MicrocosmID as MicrocosmID),
      subviews: parseQuery(route.query)
    }
  })
}

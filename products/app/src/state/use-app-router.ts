import { is, object, string } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { microcosm, type MicrocosmUUID } from '@nodenogg.in/core'
import { app } from './app'

const queryParamsSchema = object({
  with: string()
})

const parseQuery = (q: unknown) => {
  if (is(queryParamsSchema, q)) {
    const parts = q.with.split(',')
    return parts.filter(microcosm.isValidMicrocosmUUID)
  } else {
    return []
  }
}

export const paramToString = <T extends string>(param: string | string[]): T =>
  Array.isArray(param) ? (param.join('') as T) : (param as T)

export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()
  console.log('HELLO!')

  const handleRoute = () => {
    const microcosmID = route.params.microcosmID as string
    console.log(paramToString(microcosmID))
    if (microcosmID && !microcosm.isValidMicrocosmUUID(paramToString(microcosmID))) {
      // app.telemetry.log({
      //   name: 'useAppRouter',
      //   message: `${microcosmID} is not a valid Microcosm ID`,
      //   level: 'warn'
      // })

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
      microcosmID: microcosm.isValidMicrocosmUUID(microcosmID) && (microcosmID as MicrocosmUUID),
      subviews: parseQuery(route.query)
    }
  })
}

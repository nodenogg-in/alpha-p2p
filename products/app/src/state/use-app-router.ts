import { is, object, string, optional } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MicrocosmSchema, type MicrocosmUUID } from '@nodenogg.in/schema'
import { DEFAULT_VIEW, type ViewType } from '@/views'

const queryParamsSchema = object({
  with: optional(string()),
  view: optional(string())
})

const { isValidMicrocosmUUID } = MicrocosmSchema.utils

const parseQuery = (q: unknown) => {
  if (is(queryParamsSchema, q)) {
    const parts = q.with?.split(',') || []
    return parts.filter(isValidMicrocosmUUID)
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
    const microcosmUUID = route.params.microcosmUUID as string
    if (microcosmUUID && !isValidMicrocosmUUID(paramToString(microcosmUUID))) {
      // app.telemetry.log({
      //   name: 'useAppRouter',
      //   message: `${microcosmUUID} is not a valid Microcosm ID`,
      //   level: 'warn'
      // })

      router.push({
        name: 'NotFound',
        query: {
          message: `${microcosmUUID} is not a valid Microcosm ID`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const microcosmUUID = paramToString(route.params.microcosmUUID)
    const viewType = route.query.view as ViewType | undefined

    return {
      microcosmUUID:
        MicrocosmSchema.utils.isValidMicrocosmUUID(microcosmUUID) &&
        (microcosmUUID as MicrocosmUUID),
      subviews: parseQuery(route.query),
      viewType: viewType || DEFAULT_VIEW
    }
  })
}

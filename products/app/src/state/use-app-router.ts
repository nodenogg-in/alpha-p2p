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
    const microcosm_uuid = route.params.microcosm_uuid as string
    if (microcosm_uuid && !isValidMicrocosmUUID(paramToString(microcosm_uuid))) {
      // app.telemetry.log({
      //   name: 'useAppRouter',
      //   message: `${microcosm_uuid} is not a valid Microcosm ID`,
      //   level: 'warn'
      // })

      router.push({
        name: 'NotFound',
        query: {
          message: `${microcosm_uuid} is not a valid Microcosm UUID`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const microcosm_uuid = paramToString(route.params.microcosm_uuid)
    const viewType = route.query.view as ViewType | undefined

    return {
      microcosm_uuid:
        MicrocosmSchema.utils.isValidMicrocosmUUID(microcosm_uuid) &&
        (microcosm_uuid as MicrocosmUUID),
      subviews: parseQuery(route.query),
      viewType: viewType || DEFAULT_VIEW
    }
  })
}

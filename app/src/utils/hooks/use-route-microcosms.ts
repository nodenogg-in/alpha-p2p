// import { type NewMicrocosmSchema } from '@/microcosm/stores/use-demo-state'
import { is, object, picklist, string } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as views from '@/views'
import { isValidMicrocosmURI } from '@/microcosm/core/utils'

const viewNames = Object.keys(views) as views.ViewName[]

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

export const isValidView = (view: string | string[]) => is(picklist(viewNames), paramToString(view))

export const paramToString = (param: string | string[]) =>
  Array.isArray(param) ? param.join('/') : param

export const useRouteMicrocosms = () => {
  const route = useRoute()
  const router = useRouter()

  const handleRoute = () => {
    if (!isValidView(route.params.view)) {
      router.push({
        name: 'NotFound',
        query: {
          message: `${route.params.view} is not a valid type of view`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => ({
    view: isValidView(route.params.view) && (route.params.view as views.ViewName),
    microcosm_uris: [paramToString(route.params.microcosm_uri), ...parseQuery(route.query)]
  }))
}

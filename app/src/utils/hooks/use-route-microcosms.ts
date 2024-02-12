import { is, object, picklist, string } from 'valibot'
import { computed, watch, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as views from '@/views'
import { isValidMicrocosmURI } from 'nodenoggin-core/utils'

type MicrocosmInstance = {
  view: views.ViewName
  microcosm_uri: string
}

export const viewNames = Object.keys(views) as views.ViewName[]

const queryParamsSchema = object({
  with: string()
})

const parsePart = (part: string): MicrocosmInstance | false => {
  const parts = part.split('/')

  if (parts.length === 2 && isValidView(parts[0]) && isValidMicrocosmURI(parts[1])) {
    return {
      view: parts[0],
      microcosm_uri: parts[1]
    }
  }
  return false
}

const parseQuery = (q: unknown): MicrocosmInstance[] => {
  if (is(queryParamsSchema, q)) {
    const parts = q.with.split(',')
    return parts.map(parsePart).filter((p) => p !== false) as MicrocosmInstance[]
  } else {
    return []
  }
}

export const isValidView = (view: string | string[]): view is views.ViewName =>
  is(picklist(viewNames), paramToString(view))

export const paramToString = (param: string | string[]) =>
  Array.isArray(param) ? param.join('') : param

export const useRouteMicrocosms = (): ComputedRef<{
  main: MicrocosmInstance | false
  subviews: MicrocosmInstance[]
}> => {
  const route = useRoute()
  const router = useRouter()

  const handleRoute = () => {
    const view = route.params.view as string
    const microcosm_uri = route.params.microcosm_uri as string

    if (!isValidView(view)) {
      router.push({
        name: 'NotFound',
        query: {
          message: `${view} is not a valid type of view`
        }
      })
    }

    if (!isValidMicrocosmURI(microcosm_uri)) {
      router.push({
        name: 'NotFound',
        query: {
          message: `${microcosm_uri} is not a valid microcosm URI`
        }
      })
    }
  }

  watch(route, handleRoute)

  handleRoute()

  return computed(() => {
    const view = route.params.view as string
    const microcosm_uri = route.params.microcosm_uri as string
    return {
      main: isValidMicrocosmURI(microcosm_uri) &&
        isValidView(view) && {
          view,
          microcosm_uri
        },
      subviews: parseQuery(route.query)
    }
  })
}

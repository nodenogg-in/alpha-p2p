import { is, object, picklist, string } from 'valibot'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidMicrocosmURI } from 'nodenoggin-core/utils'
import type { ViewName } from 'nodenoggin-core/views'
import { views } from '@/views'

type MicrocosmInstance = {
  view: ViewName
  microcosm_uri: string
}

export const viewNames = Object.keys(views) as ViewName[]

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

export const isValidView = (view: string | string[]): view is ViewName =>
  is(picklist(viewNames), paramToString(view))

export const paramToString = <T extends string>(param: string | string[]): T =>
  Array.isArray(param) ? (param.join('') as T) : (param as T)

export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()

  const handleRoute = () => {
    const view = route.params.view as string
    const microcosm_uri = route.params.microcosm_uri as string

    if (view && !isValidView(paramToString(view))) {
      router.push({
        name: 'NotFound',
        query: {
          message: `${view} is not a valid type of view`
        }
      })
    }

    if (microcosm_uri && !isValidMicrocosmURI(paramToString(microcosm_uri))) {
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
    const view = paramToString(route.params.view)
    const microcosm_uri = paramToString(route.params.microcosm_uri)
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

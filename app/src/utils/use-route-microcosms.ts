// import { type NewMicrocosmSchema } from '@/stores/use-demo-state'
import { is, object, string } from 'valibot'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// const isValidFormat = (input: string): boolean | NewMicrocosmSchema => {
//   const parts = input.split('/')
//   const isValid = parts.length === 2 && parts[0] !== '' && parts[1] !== ''

//   if (!isValid) {
//     return false
//   }

//   return {
//     namespace_id: parts[0],
//     microcosm_id: parts[1]
//   }
// }

// const isValidMicrocosm = (f: ReturnType<typeof isValidFormat>): f is NewMicrocosmSchema => !!f

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
  return {
    primary: computed(() =>
      Array.isArray(route.params.microcosm_uri)
        ? route.params.microcosm_uri.join('/')
        : route.params.microcosm_uri
    ),
    secondary: computed(() => parseQuery(route.query))
  }
}

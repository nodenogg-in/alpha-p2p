import { WebrtcProvider } from 'y-webrtc'
import type { SyncedMicrocosm } from './SyncedMicrocosm'
import { optional, type Input, string, object, is } from 'valibot'
import { Emitter } from './Emitter'

const defaultSignaling = ['wss://nodenoggin-y-webrtc-eu.fly.dev/']

const userSchema = object({
  user_id: string(),
  username: optional(string())
})

export type User = Input<typeof userSchema>

type ProviderEvents = {
  user: User
}

enum EventNames {
  User = 'user'
}

export class Provider extends Emitter<ProviderEvents> {
  provider: WebrtcProvider

  constructor(microcosm: SyncedMicrocosm, signaling: string[] = defaultSignaling) {
    super()
    this.provider = new WebrtcProvider(microcosm.microcosm_id, microcosm.doc, {
      password: microcosm.password,
      signaling
    })

    this.provider.awareness.on('change', () => {
      console.log(this.provider.awareness.getStates())
      this.provider.awareness.getStates().forEach((state) => {
        if (state.user && is(userSchema, state.user)) {
          this.emit(EventNames.User, state.user)
        }
      })
    })
    this.provider.awareness.on('update', () => {
      console.log(this.provider.awareness.getStates())
      this.provider.awareness.getStates().forEach((state) => {
        if (state.user && is(userSchema, state.user)) {
          this.emit(EventNames.User, state.user)
        }
      })

    })
  }

  public join = (user: User): void => {
    console.log('identifying')
    this.provider.awareness.setLocalStateField(EventNames.User, user)
  }

  public leave = () => {
    this.provider.awareness.setLocalState(null)
  }
}

// const useEvents = <T>(emitter: Emitter<T>, name: keyof T, defaultValue: T[typeof name]) => {
//   const store = ref<T[typeof name]>(defaultValue)

//   emitter.subscribe(name, (v) => {
//     store.value = v
//   })
//   return store
// }

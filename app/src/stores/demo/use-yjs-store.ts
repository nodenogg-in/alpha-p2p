import { createUuid } from '@/utils'
import { localRef } from '@/utils/local-storage'
import { SyncedMicrocosm, type User } from '@/utils/yjs/SyncedMicrocosm'
import { defineStore } from 'pinia'
import { string } from 'valibot'
import { reactive, ref, onMounted } from 'vue'

type YJSStore = any

export const useYJSStore = defineStore('YJS', (): YJSStore => {
  const microcosm_id = 'hello-123'
  const user_id = localRef('personalId', string(), createUuid())
  const ready = ref()

  const manager = new SyncedMicrocosm({
    user_id: user_id.value,
    microcosm_id,
    signaling: ['ws://localhost:4444']
  })

  // manager.value.doc.on('update', () => {
  //   console.log('hello update')
  //   doc.value = manager.value.doc.share
  // })

  const users = reactive<Map<string, User>>(new Map())

  onMounted(() => {
    manager.on('ready', (r: boolean) => {
      ready.value = r
      if (r) {
        console.log('joining')
        manager.join()
        // await manager.value.connect()
      }
    })
    manager.on('user', (u) => {
      users.set(u.user_id, u)
    })

    // manager.value.subscribe('user', (u) => {
    //   console.log(u)
    //   users.set(u.user_id, u)
    // })
  })

  // const subscribe
  return {
    user_id,
    users
  }
})

// export const useYMap = (key: string) => {
//   const yMapEntries = reactive<Map<string, NodeContent>>(new Map())
//   const man = useYJSStore()
//   const y = man.getMap(key)

//   if (y) {
//     y.forEach((value, key) => {
//       yMapEntries.set(key, value)
//     })

//     // Observe changes in the Y.Map
//     y.observe((event) => {
//       event.changes.keys.forEach((change, key) => {
//         if (change.action === 'add' || change.action === 'update') {
//           //@ts-ignore
//           yMapEntries.set(key, y.get(key))
//         } else if (change.action === 'delete') {
//           yMapEntries.delete(key)
//         }
//       })
//     })
//   }

//   return yMapEntries
// }

// export const useDoc = (doc: Doc) => {
//   return customRef((track, trigger) => {
//     return {
//       get() {
//         track()
//         return doc.t
//       },
//       set(newValue) {
//         clearTimeout(timeout)
//         timeout = setTimeout(() => {
//           value = newValue
//           trigger()
//         }, delay)
//       }
//     }
//   })
// }

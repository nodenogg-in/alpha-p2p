import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { joinRoom, type ActionReceiver, type ActionSender, type Room } from 'trystero'
import { defineStore } from 'pinia'

export type NNode = {
  content: string
  x: number
  y: number
}

class NNMicrocosm {
  room!: Room
  sendNode!: ActionSender<NNode>
  getNode!: ActionReceiver<unknown>

  init = (appId: string, room_id: string) => {
    this.room = joinRoom({ appId }, room_id)
    const actions = this.room.makeAction('node')
    this.sendNode = actions[0]
    this.getNode = actions[1]
  }

  leave = () => {
    this.room?.leave()
  }
}

export const useMicrocosmStore = (app_id: string, microcosm_id: string) => {
  const storeName = `microcosm-${microcosm_id}`

  return defineStore(storeName, () => {
    const microcosm = ref(new NNMicrocosm())
    const nodes = ref<NNode[]>([])

    const init = () => {
      microcosm.value.init(app_id, microcosm_id)

      microcosm.value.getNode((data, peerId) => {
        nodes.value.push(data as NNode)
        console.log('received message from ', peerId)
      })
    }

    if (getCurrentInstance()) {
      onMounted(init)
    }

    const addNode = (node: NNode) => {
      nodes.value.push(node as NNode)
      microcosm.value.sendNode(node)
    }

    const leave = () => {
      microcosm.value?.leave()
    }

    if (getCurrentInstance()) {
      onBeforeUnmount(leave)
    }

    return {
      nodes,
      addNode
    }
  })
}

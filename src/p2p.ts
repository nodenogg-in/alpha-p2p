import { joinRoom, type ActionReceiver, type ActionSender, type Room } from 'trystero'

export type NNode = {
  content: string
  x: number
  y: number
}

export class P2PManager {
  room!: Room
  sendNode!: ActionSender<NNode>
  getNode!: ActionReceiver<unknown>
  peers: string[] = []

  init = (appId: string, microcosm_id: string) => {
    if (this.room) {
      this.leave()
    }
    this.room = joinRoom({ appId }, microcosm_id)
    const actions = this.room.makeAction('node')

    this.sendNode = actions[0]
    this.getNode = actions[1]
    this.room.onPeerJoin(this.onPeerJoin)
    this.room.onPeerLeave(this.onPeerLeave)
  }

  leave = () => {
    this.room?.leave()
  }

  onPeerJoin = (peerId: string) => {
    this.peers.push(peerId)
  }

  onPeerLeave = (peerId: string) => {
    this.peers.filter((id) => id !== peerId)
  }
}

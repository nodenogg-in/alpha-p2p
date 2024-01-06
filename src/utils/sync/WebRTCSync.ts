import {
  joinRoom,
  type ActionReceiver,
  type ActionSender,
  type Room,
  type BaseRoomConfig
} from 'trystero'

export type NNode = {
  id: string
  content: string
  x: number
  y: number
}

export type WebRTCStrategy = (config: BaseRoomConfig, roomId: string) => Room

export class WebRTCSync {
  room!: Room
  sendNode!: ActionSender<NNode>
  getNode!: ActionReceiver<unknown>
  peers: string[] = []

  public init = (appId: string, microcosm_id: string, connector: WebRTCStrategy = joinRoom) => {
    if (this.room) {
      this.leave()
    }
    this.room = connector({ appId }, microcosm_id)
    const actions = this.room.makeAction('node')

    this.sendNode = actions[0]
    this.getNode = actions[1]
    this.room.onPeerJoin(this.onPeerJoin)
    this.room.onPeerLeave(this.onPeerLeave)
  }

  public leave = () => {
    this.room?.leave()
  }

  public onPeerJoin = (peerId: string) => {
    this.peers.push(peerId)
  }

  public onPeerLeave = (peerId: string) => {
    this.peers.filter((id) => id !== peerId)
  }
}

import { joinRoom, type BaseRoomConfig } from 'trystero'
import { WebRTCSync } from './WebRTCSync'
import type { TorrentRoomConfig } from 'trystero/torrent'

const trackerUrls = ['wss://nodenoggin-torrent.fly.dev']

export const createTorrentSync = (uri: string, password?: string) =>
  new WebRTCSync({
    strategy: (config: BaseRoomConfig & TorrentRoomConfig, roomId: string) =>
      joinRoom({ ...config, trackerUrls }, roomId),
    uri,
    password
  })

import { joinRoom } from 'trystero/firebase'
import { WebRTCSync } from './WebRTCSync'
import { FIREBASE_SIGNALLING_SERVER_URL } from '@/constants/network'

export const createFirebaseSync = (uri: string, password?: string) =>
  new WebRTCSync({
    strategy: joinRoom,
    appId: FIREBASE_SIGNALLING_SERVER_URL,
    uri,
    password
  })

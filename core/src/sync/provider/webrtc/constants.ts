import { WebRTCServers } from './create'

export const iceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

export const servers: WebRTCServers = {
  local: {
    domain: 'localhost:3000'
  },
  production: {
    domain: 'nodenoggin-webrtc-performance.fly.dev',
    secure: true
  },
  azure: {
    domain: 'websocketsnodenoggin.azurewebsites.net',
    secure: true
  }
}

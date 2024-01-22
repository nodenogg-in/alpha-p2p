import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import type { ProviderFactory } from '../SyncedMicrocosm'

const defaultIceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

export const servers: Record<string, WebRTCServerConfig> = {
  local: {
    domain: 'localhost:4444'
  },
  production: {
    domain: 'nodenoggin-webrtc-performance.fly.dev',
    secure: true
  }
}

const getServerConfig = (serverName?: string) => {
  if (serverName && servers[serverName]) {
    return servers[serverName]
  }

  const fromEnv = import.meta.env.VITE_SYNC_SERVER
  if (fromEnv && servers[fromEnv]) {
    return servers[fromEnv]
  }

  return servers.production
}

export type WebRTCServerConfig = {
  domain: string
  secure?: boolean
  password?: string
  iceServers?: { urls: string }[]
}

export const createWebRTCProvider = (serverName?: string): ProviderFactory => {
  const { secure, domain, iceServers = defaultIceServers } = getServerConfig(serverName)
  return async (microcosm_uri, doc, password?) => {
    try {
      const http = `http${secure ? 's' : ''}://${domain}`

      const test = await fetch(http)
      const response = await test.json()

      if (!is(object({ status: literal('ok') }), response)) {
        throw new Error()
      }

      return new WebrtcProvider(microcosm_uri, doc, {
        password,
        signaling: [`ws${secure ? 's' : ''}://${domain}`],
        peerOpts: {
          iceServers
        }
      })
    } catch (e) {
      throw new Error(`Could not connect to WebRTC signalling server: ${domain}`)
    }
  }
}

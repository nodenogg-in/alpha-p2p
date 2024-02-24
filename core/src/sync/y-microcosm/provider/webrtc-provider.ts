import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import type { ProviderFactory } from '.'
import { isStringURL } from '../../../utils'

const iceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

const servers: WebRTCServers = {
  local: 'http://localhost:3000',
  production: 'https://nodenoggin-webrtc-performance.fly.dev',
  azure: 'https://websocketsnodenoggin.azurewebsites.net'
}

const getServerConfig = (servers: WebRTCServers, serverName?: string) => {
  if (isStringURL(serverName)) {
    return serverName
  }
  if (serverName && servers[serverName]) {
    return servers[serverName]
  }

  return servers.local
}

export type WebRTCServers = Record<string, string> & { production: string }

export const createWebRTCProvider = (nameOrURL?: string): ProviderFactory => {
  const url = getServerConfig(servers, nameOrURL)
  const secure = url.startsWith('https')

  return async (microcosm_uri, doc, password?) => {
    try {
      const http = `http${secure ? 's' : ''}://${url}`

      const test = await fetch(http)

      const response = await test.json()

      if (!is(object({ status: literal('ok') }), response)) {
        throw new Error()
      }

      return new WebrtcProvider(microcosm_uri, doc, {
        password,
        signaling: [`ws${secure ? 's' : ''}://${url}`],
        peerOpts: {
          iceServers
        }
      })
    } catch (e) {
      console.log(e)
      throw new Error(`Could not connect to WebRTC signalling server: ${url}`)
    }
  }
}

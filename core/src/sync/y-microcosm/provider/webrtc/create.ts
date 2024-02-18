import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import { ProviderFactory } from '..'
import { iceServers, servers } from './constants'

const getServerConfig = (servers: WebRTCServers, serverName?: string) => {
  if (serverName && servers[serverName]) {
    return servers[serverName]
  }

  return servers.local
}

export type WebRTCServerConfig = {
  domain: string
  secure?: boolean
  password?: string
  iceServers?: { urls: string }[]
}

export type WebRTCServers = Record<string, WebRTCServerConfig> & { production: WebRTCServerConfig }

export const createWebRTCProvider = (serverName?: string): ProviderFactory => {
  const { secure, domain } = getServerConfig(servers, serverName)
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
      console.log(e)
      throw new Error(`Could not connect to WebRTC signalling server: ${domain}`)
    }
  }
}

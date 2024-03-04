import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import type { ProviderFactory } from '.'

const iceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

export type WebRTCServers = Record<string, string> & { production: string }

export const createWebRTCProvider =
  (url: string): ProviderFactory =>
  async (microcosm_uri, doc, password?) => {
    try {
      const test = await fetch(url)
      const response = await test.json()

      if (!is(object({ status: literal('ok') }), response)) {
        throw new Error()
      }

      return new WebrtcProvider(microcosm_uri, doc, {
        password,
        signaling: [url.replace('http', 'ws')],
        peerOpts: {
          iceServers
        }
      })
    } catch (e) {
      console.log(e)
      throw new Error(`Could not connect to WebRTC signalling server: ${url}`)
    }
  }

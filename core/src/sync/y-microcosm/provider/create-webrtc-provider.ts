import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import type { ProviderFactory } from '.'
import { Instance } from '../../../app/Instance'
import { isString } from '../../../utils'

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
      if (!isString(url)) {
        throw new Error(`${url} is not a valid URL`)
      }
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
    } catch (error) {
      throw Instance.telemetry.throw(error, {
        name: 'createWebRTCProvider',
        message: `Could not connect to WebRTC signalling server: ${url}`,
        level: 'warn',
        error
      })
    }
  }

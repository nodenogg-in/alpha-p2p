import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import type { ProviderFactory } from '.'
import { Instance } from '../../../app/Instance'
import { isString } from '../../../utils'
import { TelemetryError } from '../../../app/state/Telemetry'

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
        throw new TelemetryError(`${url} is not a valid URL`)
      }
      const test = await fetch(url)
      const response = await test.json()

      if (!is(object({ status: literal('ok') }), response)) {
        throw new TelemetryError(`${url} did not return a valid response`)
      }

      return new WebrtcProvider(microcosm_uri, doc, {
        password,
        signaling: [url.replace('http', 'ws')],
        peerOpts: {
          iceServers
        }
      })
    } catch (error) {
      throw Instance.telemetry.catch({
        name: 'createWebRTCProvider',
        message: `Could not connect to WebRTC signalling server: ${url}`,
        level: 'warn',
        error
      })
    }
  }

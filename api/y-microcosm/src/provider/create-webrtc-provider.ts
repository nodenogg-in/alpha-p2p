import { is, literal, object } from 'valibot'
import { WebrtcProvider } from 'y-webrtc'
import { TelemetryError } from '@nodenogg.in/framework'
import { isValidURL } from '@nodenogg.in/toolkit'
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
      if (!isValidURL(url)) {
        throw new TelemetryError({
          name: 'createWebRTCProvider',
          message: `Invalid server URL: ${url}`,
          level: 'warn'
        })
      }
      const test = await fetch(url).catch((error) => {
        throw new TelemetryError({
          name: 'createWebRTCProvider',
          message: `Server: ${url} not accessible`,
          level: 'warn',
          error
        })
      })

      const response = await test.json()

      if (!is(object({ status: literal('ok') }), response)) {
        throw new TelemetryError({
          name: 'createWebRTCProvider',
          message: `${url} did not return a valid response`,
          level: 'warn'
        })
      }

      return new WebrtcProvider(microcosm_uri, doc, {
        password,
        signaling: [url.replace('http', 'ws')],
        peerOpts: {
          iceServers
        }
      })
    } catch (error) {
      throw new TelemetryError({
        name: 'createWebRTCProvider',
        message: `Could not connect to WebRTC signalling server: ${url}`,
        level: 'warn',
        error
      })
    }
  }

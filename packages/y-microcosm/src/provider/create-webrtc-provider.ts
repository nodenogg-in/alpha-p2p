import { WebrtcProvider } from 'y-webrtc'
import { NNError } from '@nodenogg.in/core'
import { isObject, isValidURL } from '@figureland/kit/tools/guards'
import type { ProviderFactory } from '.'

const iceServers = [
  {
    urls: 'stun.l.google.com:19302'
  }
]

const isOK = (status: unknown) => isObject(status) && 'status' in status && status.status === 'ok'

export type WebRTCServers = Record<string, string> & { production: string }

export const createWebRTCProvider =
  (url: string): ProviderFactory =>
  async (microcosmID, doc, password?) => {
    try {
      if (!isValidURL(url)) {
        throw new NNError({
          name: 'createWebRTCProvider',
          message: `Invalid server URL: ${url}`,
          level: 'warn'
        })
      }
      const test = await fetch(url).catch((error) => {
        throw new NNError({
          name: 'createWebRTCProvider',
          message: `Server: ${url} not accessible`,
          level: 'warn',
          error
        })
      })

      const response = await test.json()

      if (!isOK(response)) {
        throw new NNError({
          name: 'createWebRTCProvider',
          message: `${url} did not return a valid response`,
          level: 'warn'
        })
      }

      return new WebrtcProvider(microcosmID, doc, {
        password,
        signaling: [url.replace('http', 'ws')],
        peerOpts: {
          iceServers
        }
      })
    } catch (error) {
      throw new NNError({
        name: 'createWebRTCProvider',
        message: `Could not connect to WebRTC signalling server: ${url}`,
        level: 'warn',
        error
      })
    }
  }

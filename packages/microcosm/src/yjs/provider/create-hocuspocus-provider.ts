import { HocuspocusProvider, HocuspocusProviderWebsocket } from '@hocuspocus/provider'
import { isValidURL } from '@figureland/kit/tools'
import { TelemetryError } from '../../telemetry'
import type { ProviderFactory } from '.'

export const createHocuspocusProvider = (url: string): ProviderFactory => {
  if (!isValidURL(url)) {
    console.log(
      new TelemetryError({
        name: 'createHocuspocusProvider',
        message: `Invalid provider URL: ${url}`,
        level: 'fail'
      })
    )
  }

  const websocketProvider = new HocuspocusProviderWebsocket({
    url,
    quiet: true
  })

  return async (name, document, token = 'default') => {
    try {
      return new HocuspocusProvider({
        url,
        document,
        name,
        token,
        websocketProvider
      })
    } catch (error) {
      throw new TelemetryError({
        name: 'createHocuspocusProvider',
        message: `Failed to connect to ${url}`,
        level: 'fail',
        error
      })
    }
  }
}

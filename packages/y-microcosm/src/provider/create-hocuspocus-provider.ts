import { HocuspocusProvider, HocuspocusProviderWebsocket } from '@hocuspocus/provider'
import { isValidURL } from '@figureland/kit/tools'
import { NNError } from '@nodenogg.in/core'
import type { ProviderFactory } from '.'

export const createHocuspocusProvider = ({ sync }: { sync: string }): ProviderFactory => {
  const url = sync
  if (!isValidURL(url)) {
    console.log(
      new NNError({
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
      throw new NNError({
        name: 'createHocuspocusProvider',
        message: `Failed to connect to ${url}`,
        level: 'fail',
        error
      })
    }
  }
}

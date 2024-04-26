import {
  isValidMicrocosmID,
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI
} from '@nodenogg.in/microcosm'
import { isString } from '@figureland/typekit/guards'
import type { MicrocosmEntryRequest, Session } from '.'
import type { IdentitySession } from './identity'
import { Telemetry } from '@nodenogg.in/microcosm/telemetry'

export const createMicrocosmManager = <
  M extends MicrocosmAPI = MicrocosmAPI,
  T extends Telemetry = Telemetry
>({
  api,
  identity,
  session,
  telemetry
}: {
  api: MicrocosmAPIFactory<M>
  identity: IdentitySession
  session: Session
  telemetry?: T
}) => {
  const microcosms = new Map<MicrocosmID, M>()
  const register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmID(config.microcosmID)) {
        throw telemetry?.throw({
          name: 'microcosms',
          message: `Invalid microcosm ID: ${config.microcosmID}`,
          level: 'warn'
        })
      }
      if (config.view && !isString(config.view)) {
        throw telemetry?.throw({
          name: 'microcosms',
          message: `Invalid view: ${config.view}`,
          level: 'warn'
        })
      }
      const reference = session.register(config)
      session.setActive(config.microcosmID)

      const timer = telemetry?.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.microcosmID}`,
        level: 'info'
      })
      if (microcosms.size > 5) {
        telemetry?.log({
          name: 'microcosms',
          message: `Performance warning: ${microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      if (microcosms.has(config.microcosmID)) {
        timer?.finish()
        return microcosms.get(config.microcosmID) as M
      }
      const microcosm = await api(
        {
          ...reference,
          identityID: identity.key('identityID').get()
        },
        telemetry
      )

      microcosms.set(config.microcosmID, microcosm)
      timer?.finish()
      return microcosm
    } catch (error) {
      throw telemetry?.catch(error)
    }
  }

  const remove = async (microcosmID: MicrocosmID) => {
    const microcosm = microcosms.get(microcosmID)
    if (microcosm) {
      microcosm.dispose()
      session.remove(microcosmID)
      microcosms.delete(microcosmID)
    }
  }

  const dispose = async () => {
    for (const { dispose } of microcosms.values()) {
      dispose()
    }
    microcosms.clear()
  }

  return {
    register,
    remove,
    dispose
  }
}

export interface MicrocosmManager<M extends MicrocosmAPI> {
  register: (config: MicrocosmEntryRequest) => Promise<M>
  remove: (microcosmID: MicrocosmID) => Promise<void>
  dispose: () => Promise<void>
}

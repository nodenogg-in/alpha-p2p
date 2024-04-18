import {
  isValidMicrocosmID,
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI
} from '@nodenogg.in/microcosm'
import { isString } from '@figureland/typekit'
import { type MicrocosmEntryRequest, Telemetry, Session } from '.'
import { IdentitySession } from './identity'

export const createMicrocosmManager = <M extends MicrocosmAPI, T extends Telemetry>({
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

  const registerMicrocosm = async (config: MicrocosmEntryRequest): Promise<M> => {
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
      const reference = session.registerReference(config)
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
      console.log('registering new microcosm')
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

  const deleteMicrocosm = async (microcosmID: MicrocosmID) => {
    const microcosm = microcosms.get(microcosmID)
    if (microcosm) {
      await microcosm.dispose()
      session.removeReference(microcosmID)
      microcosms.delete(microcosmID)
    }
  }

  const dispose = async () => {
    for await (const { dispose } of microcosms.values()) {
      await dispose()
    }
    microcosms.clear()
  }

  return {
    registerMicrocosm,
    deleteMicrocosm,
    dispose
  }
}

export interface MicrocosmManager<M extends MicrocosmAPI> {
  registerMicrocosm: (config: MicrocosmEntryRequest) => Promise<M>
  deleteMicrocosm: (microcosmID: MicrocosmID) => Promise<void>
  dispose: () => Promise<void>
}

import type { Action, IDENTITY_STATUS, IdentifyAction } from '@/types/actions'
import { identitySchema } from '@/types/schema'
import { createTimestamp, createUuid } from '@/utils'
import { getLocalIdentity, signData, validateAction } from '@/utils/crypto'
import { localReactive } from '@/utils/local-storage'
import { BroadcastChannelSync } from '@/utils/sync/BroadcastChannelSync'
import { deepmerge } from 'deepmerge-ts'
import { defineStore } from 'pinia'
import { number, object, string } from 'valibot'
import { onMounted, ref } from 'vue'

const AUTH_STORE_NAME = 'identity' as const

export const useIdentity = defineStore(AUTH_STORE_NAME, () => {
  const keys = ref<CryptoKeyPair>()

  // Identity store (user_id and username)
  // 'localReactive' is a wrapper around vue's reactive() that persists it to local storage.
  const user = localReactive(
    [AUTH_STORE_NAME, 'user'],
    object({ user_id: string(), updated: number() }),
    {
      user_id: createUuid(),
      updated: createTimestamp()
    }
  )
  const meta = localReactive([AUTH_STORE_NAME, 'meta'], identitySchema, {})
  const ready = ref(false)
  // Sets up a broadcast channel. This makes sure that different
  // tabs with
  // const broadcast = ref(new BroadcastChannelSync())

  onMounted(() => {
    // console.log(broadcast)
    // broadcast.value.sendMessage()
  })

  getLocalIdentity().then((storedKeys) => {
    keys.value = storedKeys
    ready.value = true
  })

  const validate = async (payload: Action) =>
    validateAction(payload, user.user_id, keys.value?.publicKey)

  const sign = async (payload: object | string) =>
    signData(keys.value?.privateKey as CryptoKey, payload)

  const createIdentityAction = async (status: IDENTITY_STATUS): Promise<IdentifyAction> => {
    try {
      const content = deepmerge(meta, { status })
      const signature = await sign(content)
      return {
        type: 'identify',
        data: {
          signature,
          ...user,
          content
        }
      }
    } catch (e) {
      throw new Error()
    }
  }

  return {
    user,
    meta,
    ready,
    createIdentityAction,
    validate,
    sign
  }
})

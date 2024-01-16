import { defineStore } from 'pinia'
import { map, string } from 'valibot'
import { deepmerge } from 'deepmerge-ts'

import type { CreateNodeAction, RemoveNodeAction, UpdateNodeAction } from '@/types/actions'
import { nodeSchema, type Node } from '@/types/schema'
import { createURI } from '@/utils'
import { localReactive } from '@/utils/local-storage'

const MICROCOSM_STORE_NAME = 'microcosm' as const
const DEV__LOCAL_NODES_STORE_NAME = 'local' as const
const DEV__REMOTE_NODES_STORE_NAME = 'remote' as const

/**
 * Hook to provide access to a dynamic Pinia store
 * for each microcosm. Automatically backs up store to localStorage.
 */
export const useMicrocosm = (namespace_id: string, microcosm_id: string) => {
  // Create our URI, which is a globally unique identifier for a microcosm
  const uri = createURI(namespace_id, microcosm_id)

  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, uri].join('/')

  return defineStore(storeName, () => {
    const localNodes = localReactive<Map<string, Node>>(
      [storeName, DEV__LOCAL_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    const remoteNodes = localReactive<Map<string, Node>>(
      [storeName, DEV__REMOTE_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    // Create a node
    const createNode = (data: CreateNodeAction['data'], remote: boolean) => {
      if (remote) {
        const existing = remoteNodes.get(data.id)
        if (!existing || data.updated > existing.updated) {
          remoteNodes.set(data.id, data)
        }
      } else {
        const existing = localNodes.get(data.id)
        if (!existing || data.updated > existing.updated) {
          localNodes.set(data.id, data)
        }
      }
    }

    // Remove a node
    const removeNode = async (data: RemoveNodeAction['data'], remote: boolean) => {
      if (remote) {
        remoteNodes.delete(data.id)
      } else {
        localNodes.delete(data.id)
      }
    }

    // Method to update a node
    const updateNode = (data: UpdateNodeAction['data'], remote: boolean) => {
      if (remote) {
        const existing = remoteNodes.get(data.id)
        if (existing && data.updated > existing.updated) {
          // Patch each node with the update
          remoteNodes.set(data.id, deepmerge(remoteNodes.get(data.id), data) as Node)
        } else {
          console.log(`warning: missing existing entry for remote node: ${data.id}`)
        }
      } else {
        const existing = localNodes.get(data.id)
        if (existing && data.updated > existing.updated) {
          // Patch each node with the update
          localNodes.set(data.id, deepmerge(localNodes.get(data.id), data) as Node)
        } else {
          console.log(`warning: missing existing entry for local node: ${data.id}`)
        }
      }
    }

    const getNode = (id: string, localOnly?: boolean): Node | undefined => {
      const target = localNodes.get(id)
      if (target) {
        return target
      } else if (!target && !localOnly) {
        return remoteNodes.get(id)
      } else {
        return undefined
      }
    }

    const getAllNodes = (): Node[] => [
      ...Array.from(localNodes.values()),
      ...Array.from(remoteNodes.values())
    ]

    return {
      uri,
      namespace_id,
      microcosm_id,
      localNodes,
      remoteNodes,
      getNode,
      createNode,
      updateNode,
      getAllNodes,
      removeNode
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

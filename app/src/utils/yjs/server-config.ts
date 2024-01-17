import type { SyncedMicrocosmServerConfig } from './SyncedMicrocosm'

export const servers: Record<string, SyncedMicrocosmServerConfig> = {
  local: {
    domain: 'localhost:4444'
  },
  production: {
    domain: 'nodenoggin-webrtc-performance.fly.dev',
    secure: true
  }
}

export const getServerConfig = (serverName?: string) => {
  if (serverName && servers[serverName]) {
    return servers[serverName]
  }

  const fromEnv = import.meta.env.VITE_SYNC_SERVER
  if (fromEnv && servers[fromEnv]) {
    return servers[fromEnv]
  }

  return servers.production
}

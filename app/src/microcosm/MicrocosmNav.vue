<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentMicrocosm } from '@/state'
import { pluralize } from '@/utils/pluralize'
import { clamp } from 'nodenoggin-core/canvas';

const microcosm = useCurrentMicrocosm()

const peerCount = computed(() => clamp(microcosm.identities.filter((identity) => identity.joined).length - 1, 0))
</script>

<template>
  <nav class="microcosm-nav">
    <header class="title">
      {{ microcosm.microcosm_uri }}
    </header>
    <aside class="status">
      <div role="presentation" :class="{
        indicator: true,
        connected: microcosm.connected
      }" />
      <p v-if="peerCount">Connected with {{ pluralize(peerCount, 'other') }}</p>
    </aside>
  </nav>
</template>

<style scoped>
nav.microcosm-nav {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  padding: 10px;
  z-index: 110;
  display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: none;
}

div.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ui-50);
}

div.indicator.connected {
  background: var(--ui-green-100);
}

aside.status {
  border-radius: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 10px;
  font-weight: bold;
  margin: 0 4px;
  position: absolute;
  right: 10px;
  background: var(--ui-100);
}

aside.status>p {
  margin-left: 4px;
}

header.title {
  display: flex;
  border-radius: var(--ui-radius);
  font-size: 15px;
  letter-spacing: -0.02em;
  font-weight: 600;
  align-items: center;
  color: var(--ui-0);
  /* background: var(--ui-100); */
  padding: 2px 5px;
}
</style>
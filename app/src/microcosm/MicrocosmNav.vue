<script setup lang="ts">
import { computed } from 'vue'
import { viewTypes } from '@nodenogg.in/core/schema'
import { clamp } from '@nodenogg.in/utils'

import { useCurrentMicrocosm, useCurrentView } from '@/state'
import Select from '@/components/select/Select.vue'
import SelectItem from '@/components/select/SelectItem.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentView()

const peerCount = computed(() =>
  clamp(microcosm.identities.filter((identity) => identity.joined).length - 1, 0)
)

const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`
</script>
<template>
  <nav class="microcosm-nav">
    <Select class="selecter" v-model="view.type" placeholder="Choose view" label="View">
      <SelectItem v-for="view in viewTypes" :key="`${microcosm.microcosm_uri}${view}`" :text="view" :value="view" />
    </Select>
  </nav>

  <aside class="status">
    <div role="presentation" :class="{
      indicator: true,
      connected: microcosm.status.connected
    }" />
    <p v-if="peerCount">Connected with {{ pluralize(peerCount, 'other') }}</p>
  </aside>
</template>

<style scoped>
nav.microcosm-nav {
  position: absolute;
  z-index: 200;
  inset: 0;
  top: var(--size-8);
  width: fit-content;
  height: fit-content;
  margin-inline: auto;
}

div.indicator {
  width: var(--size-8);
  height: var(--size-8);
  border-radius: 50%;
  background: var(--ui-50);
}

div.indicator.connected {
  background: var(--ui-green);
}

aside.status {
  border-radius: var(--size-24);
  height: var(--size-24);
  min-width: var(--size-24);
  padding: 0 var(--size-8);
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 0.8em;
  font-weight: bold;
  margin: 0 var(--size-4);
  position: absolute;
  right: 10px;
  top: 10px;
  background: var(--ui-100);
  z-index: 100;
}

aside.status>p {
  margin-left: 4px;
}
</style>

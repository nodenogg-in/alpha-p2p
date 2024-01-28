<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentMicrocosm } from '@/microcosm/stores'
import { pluralize } from '@/utils'
import { clamp } from '@/views/spatial/utils/number';

const microcosm = useCurrentMicrocosm()

const peerCount = computed(() => clamp(microcosm.identities.filter((identity) => identity.joined).length - 1, 0, Infinity))
</script>

<template>
  <nav>
    <h1>
      {{ microcosm.microcosm_uri }}
    </h1>
    <aside>
      <div :class="{
        indicator: true,
        connected: microcosm.connected
      }" />
      <p v-if="peerCount">Connected with {{ pluralize(peerCount, 'other') }}</p>
    </aside>
  </nav>
</template>

<style scoped>
nav {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  padding: 10px;
  z-index: 10;
  display: flex;
  display: flex;
  align-items: center;
  justify-content: center;
}

div.indicator {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: white;
}

.indicator.connected {
  background: rgb(133, 229, 133);
}

aside {
  background: rgb(255, 255, 255);
  border-radius: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 9px;
  font-weight: bold;
  margin: 0 4px;
  position: absolute;
  right: 10px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
}

aside>p {
  margin-left: 4px;
}

h1 {
  display: flex;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  align-items: center;
  background: white;
  padding: 2px 8px;
}
</style>

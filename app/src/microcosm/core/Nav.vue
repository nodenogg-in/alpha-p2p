<script setup lang="ts">
import { computed } from 'vue'

import { useApp, useCurrentMicrocosm } from '@/microcosm/stores'
import { pluralize } from '@/utils'

const microcosm = useCurrentMicrocosm()
const app = useApp()

const peerCount = computed(() => microcosm.identities.filter((identity) => identity.joined).length - 1)
</script>

<template>
  <nav>
    <button @click="app.menuOpen = !app.menuOpen">Menu</button>
    <h1>
      {{ microcosm.microcosm_uri }}
    </h1>
    <div>
      <aside v-if="peerCount">
        <p>Connected with {{ pluralize(peerCount, 'other') }}</p>
      </aside>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  /* background: white; */
  padding: 10px;
  z-index: 10;
  display: flex;
  /* box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1); */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

div.indicator {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: white;
  margin-right: 5px;
}

nav>h1 {
  font-size: 16px;
  font-weight: 700;
  margin-right: 10px;
}

div {
  display: flex;
  align-items: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.dot {
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background: rgb(113, 113, 113);
  display: inline-block;
  margin-right: 5px;
}

.indicator.connected {
  background: rgb(133, 229, 133);
}

aside {
  background: rgb(255,255,255);
  border-radius: 24px;
  height: 24px;
  padding: 0 8px;
  align-items: center;
  display: flex;
  font-size: 9px;
  font-weight: bold;
  margin: 0 4px;
}

details {
  padding: 0;
}

details+details {
  border-top: none;
}

details[open] {
  padding-bottom: 0;
}

summary {
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
}
button {
  background: white;
  height: 32px;
  padding: 2px 8px;
}
</style>

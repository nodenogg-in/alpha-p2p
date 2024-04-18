<script lang="ts" setup>
import { useApp, useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '..'
import { useSubscribable } from '@figureland/statekit/vue';

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const app = useApp()
const machine = useSubscribable(view.actions.machine)
const transform = useSubscribable(view.interaction.transform)
</script>

<template>
  <details class="debug ui" open>
    <summary>
      <h3>Debug</h3>
    </summary>
    <!-- <h4>device</h4>
    <pre>{{ JSON.stringify(app.device, null, 2) }}</pre> -->
    <h4>canvas/transform</h4>
    <pre>{{ JSON.stringify(transform, null, 2) }}</pre>
    <h4>canvas/state</h4>
    <pre>{{ JSON.stringify(view.state, null, 2) }}</pre>
    <h4>machine</h4>
    <pre>{{ JSON.stringify(machine, null, 2) }}</pre>
    <h4>identity</h4>
    <pre>{{ JSON.stringify(app.identity, null, 2) }}</pre>
    <!-- <h4>view</h4>
    <pre>{{ JSON.stringify(view.collections, null, 2) }}</pre> -->
    <!-- <h4>microcosm</h4>
    <pre>{{ JSON.stringify(microcosm, null, 2) }}</pre> -->
    <!-- <h4>app/filedrop</h4>
    <pre>{{ JSON.stringify(app.filedrop, null, 2) }}</pre> -->
    <h4>app/pointer</h4>
    <pre>{{ JSON.stringify(app.pointer, null, 2) }}</pre>
    <!-- <h4>microcosm/status</h4>
    <pre>{{ JSON.stringify(microcosm.status, null, 2) }}</pre> -->
    <h4>view/action</h4>
    <pre>{{ JSON.stringify(view.action, null, 2) }}</pre>
    <h4>canvas/selectionGroup</h4>
    <pre>{{ JSON.stringify(view.selectionGroup, null, 2) }}</pre>
    <h4>view/selection</h4>
    <pre>{{ JSON.stringify(view.action.selection, null, 2) }}</pre>
  </details>
</template>

<style scoped>
.debug {
  position: absolute;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(5px);
  font-size: 8px;
  width: 250px;
  color: var(--ui-10);
  top: var(--size-8);
  right: var(--size-8);
  max-height: 100%;
  border-radius: var(--ui-radius);
  transform-origin: 0% 0%;
  padding: var(--size-8);
  overflow-y: scroll;
  user-select: none;
}

summary {
  cursor: pointer;
  display: flex;
  padding-bottom: 4px;
}

@media (prefers-color-scheme: dark) {
  .debug {
    background-color: rgba(30, 30, 30, 0.75);
  }
}

h3,
h4 {
  font-size: 14px;
}
</style>
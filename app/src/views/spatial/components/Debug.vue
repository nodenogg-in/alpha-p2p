<script lang="ts" setup>
import { ui, useApp, useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '..'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const app = useApp()
</script>

<template>
  <div class="debug ui">
    <h4>device</h4>
    <pre>{{ JSON.stringify(ui.device.get(), null, 2) }}</pre>
    <h4>microcosm/status</h4>
    <pre>{{ JSON.stringify(microcosm.status, null, 2) }}</pre>
    <h4>view/action</h4>
    <pre>{{ JSON.stringify(view.action, null, 2) }}</pre>
    <h4>canvas/selectionGroup</h4>
    <pre>{{ JSON.stringify(view.selectionGroup, null, 2) }}</pre>
    <h4>view/selection</h4>
    <pre>{{ JSON.stringify(view.action.selection, null, 2) }}</pre>
    <h4>app/pointer</h4>
    <pre>{{ JSON.stringify(app.pointer, null, 2) }}</pre>
  </div>
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

@media (prefers-color-scheme: dark) {
  .debug {
    background-color: rgba(30, 30, 30, 0.75);
  }
}

h4 {
  font-size: 14px;
}
</style>

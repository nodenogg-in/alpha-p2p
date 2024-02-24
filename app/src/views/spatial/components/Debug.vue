<script lang="ts" setup>
import { useApp, useCurrentMicrocosm } from '@/state';
import { useCurrentSpatialView } from '..';
const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const app = useApp()

</script>

<template>
  <div class="debug ui">
    <h4>Microcosm</h4>
    <pre>{{ JSON.stringify(microcosm.data, null, 2) }}</pre>
    <h4>View</h4>
    <pre>{{ JSON.stringify(view.state, null, 2) }}</pre>
    <h4>Pointer</h4>
    <pre>{{ JSON.stringify(app.pointer, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.debug {
  position: fixed;
  z-index: 100;
  background-color: var(--ui-90);
  font-size: 8px;
  width: 250px;
  color: var(--ui-10);
  top: 10px;
  right: 10px;
  max-height: 90vh;
  transform-origin: 0% 0%;
  padding: var(--size-12);
  overflow-y: scroll;
}

h4 {
  font-size: 14px;
}
</style>
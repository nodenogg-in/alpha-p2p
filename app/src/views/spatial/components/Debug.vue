<script lang="ts" setup>
import { useApp, useCurrentMicrocosm } from '@/state';
import { useCurrentSpatialView } from '..';

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const app = useApp()

</script>

<template>
  <div class="debug ui">
    <h4>microcosm/status</h4>
    <pre>{{ JSON.stringify(microcosm.status, null, 2) }}</pre>
    <h4>view/action</h4>
    <pre>{{ JSON.stringify(view.action, null, 2) }}</pre>
    <h4>canvas/selectionGroup</h4>
    <pre>{{ JSON.stringify(view.selectionGroup, null, 2) }}</pre>
    <h4>view/selection</h4>
    <pre>{{ JSON.stringify(view.selection, null, 2) }}</pre>
    <h4>app/pointer</h4>
    <pre>{{ JSON.stringify(app.pointer, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.debug {
  position: absolute;
  z-index: 1000;
  background-color: var(--ui-90);
  font-size: 8px;
  width: 250px;
  color: var(--ui-10);
  top: var(--size-8);
  right: var(--size-8);
  max-height: 100%;
  height: calc(100% - var(--size-16));
  border-radius: var(--ui-radius);
  transform-origin: 0% 0%;
  padding: var(--size-4);
  overflow-y: scroll;
  user-select: none;
}

h4 {
  font-size: 14px;
}
</style>
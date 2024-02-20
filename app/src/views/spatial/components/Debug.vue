<script lang="ts" setup>
import { useApp } from '@/state';
import { useCurrentSpatialView } from '..';

const view = useCurrentSpatialView()
const app = useApp()

</script>

<template>
  <div class="debug">
    <!-- <h4>View</h4>
    <pre>{{ JSON.stringify(view, null, 2) }}</pre> -->
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
  transform-origin: 0% 0%;
  padding: var(--size-12);
}

h4 {
  font-size: 14px;
}
</style>@/views/spatial/components
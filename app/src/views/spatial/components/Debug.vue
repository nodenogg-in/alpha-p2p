<script lang="ts" setup>
import { useCurrentSpatialView } from '@/views/spatial'
import { usePointer } from '@/state';

const view = useCurrentSpatialView()
const pointer = usePointer()
</script>

<template>
  <div class="debug">
    <h4>View</h4>
    <pre>{{ JSON.stringify(view, null, 2) }}</pre>
    <!-- <h4>Pointer</h4>
    <pre>{{ JSON.stringify(pointer, null, 2) }}</pre> -->
  </div>
</template>

<style scoped>
.debug {
  position: fixed;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  font-size: 8px;
  width: 250px;
  color: var(--ui-10);
  top: 10px;
  right: 10px;
  transform-origin: 0% 0%;
  padding: 10px;
  backdrop-filter: blur(10px);
}

h4 {
  font-size: 14px;
}
</style>
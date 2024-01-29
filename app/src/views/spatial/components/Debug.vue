<script lang="ts" setup>
import { useApp } from '@/microcosm/stores';
import { useCurrentSpatialView } from '@/views/spatial'
import { usePointer } from '../stores/use-pointer';

const app = useApp()
const view = useCurrentSpatialView()
const pointer = usePointer()
</script>

<template>
  <div class="debug">
    <h4>View</h4>
    <pre>{{ JSON.stringify(view, null, 2) }}</pre>
    <h4>Pointer</h4>
    <pre>{{ JSON.stringify(pointer, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.debug {
  position: fixed;
  z-index: 100;
  background: rgba(40, 40, 40, 0.9);
  font-size: 8px;
  width: 250px;
  color: white;
  top: 10px;
  right: 10px;
  transform-origin: 0% 0%;
  padding: 10px;
}

h4 {
  font-size: 14px;
}
</style>
../stores/use-spatial-view

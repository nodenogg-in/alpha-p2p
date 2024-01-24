<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { Point } from '../SpatialView.types'
import { useCurrentSpatialView } from '../stores/use-spatial-view'

const view = useCurrentSpatialView()

const props = defineProps({
  position: {
    type: Object as PropType<Point>,
    required: true
  },
  outline: {
    type: Boolean
  }
})

const style = computed(() => ({
  width: `${view.grid}px`,
  height: `${view.grid}px`,
  transform: `translate(${props.position.x}px, ${props.position.y}px)`
}))
</script>

<template>
  <div
    :class="{
      indicator: true,
      outline: props.outline
    }"
    :style="style"
  />
</template>

<style scoped>
.indicator {
  background: rgb(120, 138, 255, 0.2);
  /* border-radius: 10px; */
  /* left: -10px;
    top: -10px; */
  transform-origin: 50% 50%;
  position: absolute;
  pointer-events: none;
}

.outline {
  background: none;
  border: 1px solid black;
}
</style>
../SpatialView.types

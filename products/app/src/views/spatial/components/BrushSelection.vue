<script lang="ts" setup>
import { boxStyle } from '@figureland/infinitykit'
import { state } from '@figureland/kit/state';
import { useCurrentSpatialView } from '..'
import { onBeforeUnmount } from 'vue';
import { useSubscribable } from '@figureland/kit/state/vue';
const view = useCurrentSpatialView()

const brushSignal = state(get => {
  const box = get(view.infinitykit.state).brush
  return {
    visible: box.width > 0 && box.height > 0,
    style: `${boxStyle(box)};`
  }
})

const brush = useSubscribable(brushSignal)

onBeforeUnmount(() => {
  brushSignal.dispose()
})

</script>

<template>
  <div v-if="brush.visible" class="box" :style="brush.style"></div>
</template>

<style scoped>
.box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  box-shadow: 0 0 0 calc(1px * var(--infinitykit-inverted-scale)) var(--ui-primary-100);
}
</style>

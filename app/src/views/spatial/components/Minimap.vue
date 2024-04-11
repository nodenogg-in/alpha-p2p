<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MinimapRenderer } from '@figureland/infinitykit'
import { useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '..'

const element = ref<HTMLCanvasElement>()
const view = useCurrentSpatialView()
const microcosm = useCurrentMicrocosm()

const renderer = new MinimapRenderer({ width: 200, height: 200, nodeColor: 'yellow' })

watch([view], () => {
  if (element.value) {
    renderer.render(microcosm.api().nodes('html'), view.state)
    renderer.renderToCanvas(element.value)
  }
})
</script>

<template>
  <div class="container"><canvas ref="element" /></div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  border: 1px solid black;
  background: grey;
  z-index: 500;
  width: 200px;
  height: 200px;
}
</style>
. @/state
@/state
<script lang="ts" setup>
import { useCurrentMicrocosm } from '@/state';
import { MinimapRenderer } from 'nodenoggin/spatial';
import { ref, watch } from 'vue';
import { useCurrentSpatialView } from '..';

const element = ref<HTMLCanvasElement>()
const view = useCurrentSpatialView()
const microcosm = useCurrentMicrocosm()

const renderer = new MinimapRenderer({ width: 200, height: 200, nodeColor: 'yellow' })

watch([view.canvas], () => {
    if (element.value) {
        renderer.render(microcosm.nodesByType('html'), view.state)
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
</style>.
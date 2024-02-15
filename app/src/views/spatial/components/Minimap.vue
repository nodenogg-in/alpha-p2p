<script lang="ts" setup>
import { useCurrentMicrocosm } from '@/state';
import { renderMinimapToCanvas } from 'nodenoggin-core';
import { ref, watch } from 'vue';
import { useCurrentSpatialView } from '..';

const element = ref<HTMLCanvasElement>()
const view = useCurrentSpatialView()
const microcosm = useCurrentMicrocosm()


watch([view.canvas], () => {
    if (element.value) {
        const viewport = { ...view.canvas.state.container, ...view.canvas.state.transform.translate }
        renderMinimapToCanvas(element.value, view.canvas.state, microcosm.nodes(), {}, view.canvas.screenToCanvas(viewport))
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
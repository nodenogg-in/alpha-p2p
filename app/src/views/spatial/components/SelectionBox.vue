<script setup lang="ts">
import { computed } from 'vue';
import { isSelectTool, useCurrentSpatialView } from '../stores/use-spatial-view';
import { normalise } from '../utils/interaction';
import { useCursor } from '../stores/use-cursor';

const view = useCurrentSpatialView()
const cursor = useCursor()

const state = computed(() => {
    const box = normalise(cursor.selectionBox, view)
    return {
        active: isSelectTool(view.tool),
        style: {
            width: `${box.width}px`,
            height: `${box.height}px`,
            transform: `scale(1.0) translate(${box.x}px, ${box.y}px)`
        }
    }
})

</script>

<template>
    <div role="presentation" :class="{
        'selection-box': true,
        active: state.active
    }" :style="state.style" />
</template>

<style scoped>
div.selection-box {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(50, 50, 255, 0.05);
    border: 1px dashed rgba(80, 80, 255, 0.5);
    z-index: 100;
    transform-origin: 0% 0%;
    pointer-events: none;
    user-select: none;
    opacity: 0.0;
    border-radius: 2px;
}

div.selection-box.active {
    opacity: 1.0;
}
</style>
<script lang="ts" setup>
import { useCurrentSpatialView } from '../stores/use-spatial-view'
import { computed } from 'vue';

const view = useCurrentSpatialView();
const style = computed(() => {
    const box = view.canvasToScreen(view.selection.selection.boundingBox)
    return {
        width: `${box.width}px`,
        height: `${box.height}px`,
        transform: `translate(${box.x}px, ${box.y}px)`
    }
})


</script>

<template>
    <div class="selection-group" :style="style" />
</template>
            
<style scoped>
.selection-group {
    position: absolute;
    z-index: 100;
    /* background: rgba(50, 40, 255, 0.25);
    color: rgba(50, 40, 255, 1); */
    box-shadow: 0 0 0 3px rgba(50, 40, 255, 0.25);
    font-size: 10px;
    top: 0;
    left: 0;
    border-radius: 2px;
    transform-origin: 0% 0%;
    padding: 10px;
    display: flex;
    align-items: center;
    pointer-events: none;
}
</style>
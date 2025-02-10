<script lang="ts" setup>
import { boxStyle } from '@figureland/kit/infinity'
import { onBeforeUnmount } from 'vue';
import { vue } from '@figureland/kit/state/vue';
import { state } from '@figureland/kit/state';
import { useCurrentSpatialView } from '..'
const view = useCurrentSpatialView()

const boundsSignal = state(get => {
    const box = get(view.infinitykit.state).selectionBounds
    return {
        visible: box.width > 0 && box.height > 0,
        style: `${boxStyle(box)};`
    }
})

const bounds = vue(boundsSignal)

onBeforeUnmount(() => {
    boundsSignal.dispose()
})

</script>

<template>
    <div v-if="bounds.visible" class="bounds" :style="bounds.style"></div>
</template>

<style scoped>
.bounds {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 500;
    box-shadow: 0 0 0 calc(2px * var(--infinitykit-inverted-scale)) var(--ui-primary-100);
}
</style>

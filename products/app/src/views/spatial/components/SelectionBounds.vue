<script lang="ts" setup>
import { boxStyle } from '@figureland/infinitykit'
import { onBeforeUnmount } from 'vue';
import { useSubscribable } from '@figureland/statekit/vue';
import { signal } from '@figureland/statekit';
import { useCurrentSpatialView } from '..'
const view = useCurrentSpatialView()

const boundsSignal = signal(get => {
    const box = get(view.infinitykit.state).selectionBounds
    return {
        visible: box.width > 0 && box.height > 0,
        style: `${boxStyle(box)};`
    }
})

const bounds = useSubscribable(boundsSignal)

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

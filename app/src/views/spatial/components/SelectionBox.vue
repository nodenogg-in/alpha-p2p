<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { Box } from '../types'

const props = defineProps({
    box: {
        type: Object as PropType<Box>,
        required: true
    },
    active: {
        type: Boolean
    }
})

const style = computed(() => ({
    width: `${props.box?.width}px`,
    height: `${props.box?.height}px`,
    transform: `translate(${props.box?.x}px, ${props.box?.y}px)`
}))

</script>

<template>
    <div role="presentation" :class="{
        'selection-box': true,
        active: props.active
    }" :style="style" />
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
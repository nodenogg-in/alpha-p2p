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
    transform: `translate(${props.box?.x}px, ${props.box?.y}px) scale(1.0)`
}))
</script>

<template>
    <div :class="{
        'debug-s-box': true,
        active: props.active
    }" :style="style" />
</template>

<style scoped>
div.debug-s-box {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 0, 0, 0.15);
    box-shadow: 0 0 0 4px rgba(255, 0, 0, 0, 1);
    z-index: 100;
    transform-origin: 50% 50%;
    pointer-events: none;
    user-select: none;
    opacity: 0.0;
    border-radius: 2px;
}

div.debug-s-box.active {
    opacity: 1.0;
}
</style>
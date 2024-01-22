<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { Box } from '../types';

const props = defineProps({
    box: {
        type: Object as PropType<Box>,
        required: true
    },
    color: {
        type: String,
        default: 'red'
    }
})

const test = computed(() => ({
    backgroundColor: props.color,
    width: `${props.box.width}px`,
    height: `${props.box.height}px`,
    transform: `translate(${props.box.x}px, ${props.box.y}px)`
}))
</script>

<template>
    <div class="box" :style="test">
        <p>{{ props.box.width }}x{{ props.box.height }}</p>
        <p>
            x: {{ props.box.x }} / y: {{ props.box.y }}
        </p>
    </div>
</template>

<style scoped>
.box {
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transform-origin: 0% 0%;
    position: absolute;
}
</style>
<script setup lang="ts">
import { computed, readonly, ref, type PropType, type SVGAttributes } from 'vue';
import { useCurrentSpatialView } from '..';
import { createUuid } from '@/utils';

const id = readonly(ref(createUuid()))
const view = useCurrentSpatialView()

const props = defineProps({
    color: {
        type: String,
        default: 'rgb(220,220,220)'
    },
    backgroundColor: {
        type: String,
        default: 'rgba(255,255,255, 0.0)'
    },
    type: {
        type: String as PropType<'dots' | 'lines'>,
        default: 'lines'
    }
})
const pattern = computed((): SVGAttributes => {
    let gridSize = view.grid * view.transform.scale * 1;

    const originX = view.container.width / 2;
    const originY = view.container.height / 2;

    const scaledOriginX = originX * view.transform.scale;
    const scaledOriginY = originY * view.transform.scale;

    const position = {
        x: -(scaledOriginX - originX - view.transform.translate.x),
        y: -(scaledOriginY - originY - view.transform.translate.y)
    }

    return {
        width: gridSize,
        height: gridSize,
        patternTransform: `translate(${position.x}, ${position.y})`,
    };
});

const dotSize = computed(() => 1)

</script>
<template>
    <svg width="100%" height="100%" :style="`background-color:${props.backgroundColor};`">
        <defs>
            <pattern :id="id" patternUnits="userSpaceOnUse" v-bind="pattern">
                <g v-if="props.type === 'dots'">
                    <circle :cx="dotSize" :cy="dotSize" :r="dotSize" :fill="props.color" />
                </g>
                <g v-else>
                    <line x1="0" y1="0" :x2="pattern.width" y2="0" :stroke="props.color" />
                    <line x1="0" y1="0" x2="0" :y2="pattern.width" :stroke="props.color" />
                </g>
            </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${id})`" />
    </svg>
</template>

<style scoped>
svg {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
}
</style>
<script setup lang="ts">
import { computed, readonly, ref, type PropType, type SVGAttributes } from 'vue';
import { useCurrentSpatialView } from '..';
import { createUuid } from '@/core/utils/uuid';
import type { BackgroundPatternType } from '@/core/2d';

const id = readonly(ref(createUuid()))
const view = useCurrentSpatialView()

const props = defineProps({
    type: {
        type: String as PropType<BackgroundPatternType>,
        default: 'none'
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

const dotSize = 1

</script>
<template>
    <svg width="100%" height="100%">
        <g v-if="props.type !== 'none'">
            <defs>
                <pattern :id="id" patternUnits="userSpaceOnUse" v-bind="pattern">
                    <g v-if="props.type === 'dots'">
                        <circle :cx="dotSize" :cy="dotSize" :r="dotSize" />
                    </g>
                    <g v-else>
                        <line x1="0" y1="0" :x2="pattern.width" y2="0" />
                        <line x1="0" y1="0" x2="0" :y2="pattern.width" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" :fill="`url(#${id})`" />
        </g>
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
    background: var(--ui-100);
}

line {
    stroke-width: 3px;
    stroke: var(--ui-90);
}

circle {
    fill: var(--ui-90);
}

@media (prefers-color-scheme: dark) {
    svg {
        background: var(--ui-100);
    }

    circle {
        fill: var(--ui-80);
    }
}
</style>
<script setup lang="ts">
import { computed, type PropType, type SVGAttributes } from 'vue';
import { translate, type BackgroundPatternType } from 'nodenoggin-core/canvas';

import { useCurrentSpatialView } from '../use-spatial-view';

const view = useCurrentSpatialView()

const props = defineProps({
    type: {
        type: String as PropType<BackgroundPatternType>,
        default: 'none'
    }
})

const pattern = computed((): SVGAttributes => {
    const size = view.canvas.backgroundGrid * view.canvas.transform.scale * 1;

    const originX = view.canvas.container.width / 2;
    const originY = view.canvas.container.height / 2;

    const scaledOriginX = originX * view.canvas.transform.scale;
    const scaledOriginY = originY * view.canvas.transform.scale;

    return {
        width: size,
        height: size,
        patternTransform: translate({
            x: -(scaledOriginX - originX - view.canvas.transform.translate.x),
            y: -(scaledOriginY - originY - view.canvas.transform.translate.y)
        })
    };
});

const dotSize = 1

</script>
<template>
    <svg width="100%" height="100%">
        <g v-if="props.type !== 'none'">
            <defs>
                <pattern :id="view.microcosm_uri" patternUnits="userSpaceOnUse" v-bind="pattern">
                    <g v-if="props.type === 'dots'">
                        <circle :cx="dotSize" :cy="dotSize" :r="dotSize" />
                    </g>
                    <g v-else>
                        <line x1="0" y1="0" :x2="pattern.width" y2="0" />
                        <line x1="0" y1="0" x2="0" :y2="pattern.width" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" :fill="`url(#${view.microcosm_uri})`" />
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
</style>../use-spatial-view
<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useCurrentView } from '../stores/use-spatial-view'
import type { Size } from '../types';
import { fitAspectRatio } from '../utils/interaction';

const view = useCurrentView()

const props = defineProps({
    size: {
        type: Object as PropType<Size>,
        default: () => ({
            width: 100,
            height: 100
        })
    }
})

const px = (v: number) => `${v}px`
const transformCss = (x: number, y: number, s: number = 1) => `translate(${px(x)}, ${px(y)}) scale(${s})`

const size = computed(() => {
    const baseSize = fitAspectRatio(view.canvas, props.size, [0, 0])
    const relativeScale = baseSize.width / view.canvas.width
    const viewport = view.dimensions
    const { transform } = view

    return {
        container: {
            width: px(props.size.width),
            height: px(props.size.height)
        },
        viewport: {
            transform: transformCss(-transform.translate.x * relativeScale, -transform.translate.y * relativeScale),
            width: px(viewport.width * relativeScale / transform.scale),
            height: px(viewport.height * relativeScale / transform.scale)
        },
        canvas: {
            width: px(baseSize.width),
            height: px(baseSize.height)
        },
    }
})
</script>

<template>
    <div class="minimap-container" :style="size.container">

        <div class="minimap-viewport" :style="size.viewport">
        </div>
        <div class="minimap-canvas" :style="size.canvas"></div>
    </div>
</template>

<style scoped>
.minimap-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 50;
    background: white;
    border-radius: 2px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.25);
}

.minimap-viewport {
    transform-origin: 0% 0%;
    top: 0;
    left: 0;
    border-radius: 2px;
    position: absolute;
    z-index: 3;
    border: 1px dashed black;
}

.minimap-canvas {
    transform-origin: 0% 0%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgb(245, 245, 245);
    z-index: 2;
    border: 1px solid rgb(220, 220, 220);
}
</style>
../stores/use-spatial-view
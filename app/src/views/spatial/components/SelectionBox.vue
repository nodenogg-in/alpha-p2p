<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { isNewTool, isSelectTool, useCurrentSpatialView } from '../stores/use-spatial-view';

const view = useCurrentSpatialView()

const state = computed((): [boolean, HTMLAttributes['style']] => {
    const box = view.normalise(view.selectionBox)
    return [
        isSelectTool(view.tool) || isNewTool(view.tool),
        {
            width: `${box.width + 1}px`,
            height: `${box.height + 1}px`,
            transform: `scale(1.0) translate(${box.x}px, ${box.y}px)`
        }
    ]
})

</script>

<template>
    <div role="presentation" :class="{
        [view.tool]: true,
        'selection-box': true,
        active: state[0]
    }" :style="state[1]" />
</template>

<style scoped>
div.selection-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    transform-origin: 0% 0%;
    pointer-events: none;
    user-select: none;
    opacity: 0.0;
}

div.selection-box.active.select {
    background: rgba(50, 50, 255, 0.05);
}

div.selection-box.active.new {
    background: var(--card-neutral);
    opacity: 0.5;
    border-radius: 2px;
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.07);
}


div.selection-box.active {
    opacity: 1.0;
}
</style>
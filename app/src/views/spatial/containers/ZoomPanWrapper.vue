<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentView } from '../stores/use-spatial-view';
import { getTranslation } from '../utils/interaction'

const view = useCurrentView()

const style = computed(() => ({
    // transform: `translate(${view.transform.translate.x + (view.dimensions.width / 2)}px, ${view.transform.translate.y + (view.dimensions.height / 2)}px) scale(${view.transform.scale}) `
    transform: `translate(${view.transform.translate.x + (view.dimensions.width / 2)}px, ${view.transform.translate.y + (view.dimensions.height / 2)}px) scale(${view.transform.scale}) `
}))

</script>

<template>
    <div @contextmenu.prevent.self @click.prevent.self @touchstart.prevent.self :style="style" class="wrapper"
        role="presentation">
        <slot></slot>

    </div>
</template>

<style scoped>
.wrapper {
    border: 1px solid black;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    transform-origin: 50% 50%;
    pointer-events: none !important;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
../stores/use-spatial-view
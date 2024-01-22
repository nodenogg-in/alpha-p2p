<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentView } from '../stores/use-spatial-view';
import { getTranslation } from '../utils/interaction'

const view = useCurrentView()

const style = computed(() => ({
    transform: getTranslation(view.transform)
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
    top: 0;
    left: 0;
    transform-origin: 0% 0%;
    pointer-events: none !important;
    touch-action: none;
}
</style>
../stores/use-spatial-view
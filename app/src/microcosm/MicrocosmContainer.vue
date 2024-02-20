<script lang="ts" setup>
import { ref } from 'vue';
import { useDropZone } from '@vueuse/core';
import { useApp, useCurrentMicrocosm } from '@/state';
import { VALID_MIME_TYPES } from 'nodenoggin/utils';

const app = useApp()
const microcosm = useCurrentMicrocosm()
const element = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(element, {
    onDrop: (files) => files ? microcosm.handleDropFiles(files) : null,
    dataTypes: VALID_MIME_TYPES
})

</script>

<template>
    <section ref="element" :class="{
        'menu-open': app.menuOpen,
        container: true,
        'drop-active': isOverDropZone,
    }">
        <slot></slot>
    </section>
</template>

<style scoped>
.container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 97;
    width: 100%;
    height: 100%;
}

.container.menu-open {
    width: calc(100% - var(--app-menu-width));
}

.container::after {
    width: 100%;
    height: 100%;
    content: 'Add files';
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    z-index: 100;
    opacity: 0;
}

.container.drop-active::after {
    pointer-events: initial;
    opacity: 1;
}
</style>
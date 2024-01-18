
<script setup lang="ts">
import { ref } from 'vue'
import { parseFileListToHTML } from '../../utils/markdown'
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
const active = ref<boolean>(false)
let inActiveTimeout: ReturnType<typeof setTimeout>

const microcosm = useCurrentMicrocosm()

const setActive = () => {
    active.value = true
    clearTimeout(inActiveTimeout)
}

const setInactive = () => {
    inActiveTimeout = setTimeout(() => {
        active.value = false
    }, 50)
}

const onDrop = (e: DragEvent) => {
    if (e.dataTransfer) {
        setInactive()
        // open.value = true
        const files = [...e.dataTransfer.files]

        parseFileListToHTML(files).then(results => {
            active.value = false
            results.forEach(html => {
                microcosm.create({ html, x: 0, y: 0 })
            })
        })
    }
}

</script>

<template>
    <div :class="{ container: true, active }" :data-active="active" @dragenter.prevent="setActive"
        @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
        <slot :dropZoneActive="active"></slot>
    </div>
</template>

<style scoped>
div.container {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
}

div.container::after {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    content: 'Add files';
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 100;
    opacity: 0.0;
}

div.container.active::after {
    pointer-events: initial;
    opacity: 1.0;
}
</style>
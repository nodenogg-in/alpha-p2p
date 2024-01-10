
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { parseFileListToMarkdown } from '../utils/markdown'
const active = ref<boolean>(false)
let inActiveTimeout: ReturnType<typeof setTimeout>

const emit = defineEmits<{
    (e: 'files-dropped', results: string[]): void
}>()

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

        parseFileListToMarkdown(files).then(results => {
            console.log(results)
            emit('files-dropped', results)
        })
    }
}

const preventDefaults = (e: Event) => {
    e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {
    events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults)
    })
})

onUnmounted(() => {
    events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults)
    })
})
</script>

<template>
    <div :class="{ container: true, active }" :data-active="active" @dragenter.prevent="setActive"
        @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
        <slot :dropZoneActive="active"></slot>
    </div>
</template>

<style scoped>
div.container {
    /* box-shadow: inset 0 0 0 10px rgba(0, 0, 0, 1.0); */
    width: 100%;
    height: 100vh;
    position: relative;
    overflow-y: scroll;
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
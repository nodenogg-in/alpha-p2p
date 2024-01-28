<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useCurrentMicrocosm } from '@/microcosm/stores'
import { tinykeys } from '@/utils/libs/tinykeys';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})

const microcosm = useCurrentMicrocosm()

const filterInputEvents = (callback: (e: KeyboardEvent) => void) =>
    (e: KeyboardEvent) => {
        const isInput = e.target instanceof HTMLInputElement
        const isContentEditable = e.target instanceof HTMLElement && e.target.isContentEditable
        const isTextArea = e.target instanceof HTMLTextAreaElement

        if (!isInput && !isContentEditable && !isTextArea) {
            callback(e)
        }
    }

const unsubscribe = tinykeys(window, {
    '$mod+C': filterInputEvents(() => {
        console.log('copy')
    }),
    '$mod+X': filterInputEvents(() => {
        console.log('cut')
    }),
    '$mod+V': filterInputEvents(() => {
        console.log('paste')
    }),
    '$mod+Shift+Z': filterInputEvents(() => {
        microcosm.redo()
    }),
    '$mod+Z': filterInputEvents(() => {
        microcosm.undo()
    }),
    'Backspace': filterInputEvents(() => {

    }),
    'Escape': () => {

    }
})

onBeforeUnmount(() => {
    unsubscribe()
})
</script>

<template>
    <slot v-if="props.microcosm_uri"></slot>
</template>

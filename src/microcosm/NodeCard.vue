<script setup lang="ts">

import { starkdown } from 'starkdown'
import { computed, ref, type PropType } from 'vue';
import sanitize from 'sanitize-html'
import MarkdownEditor from './MarkdownEditor.vue';
import type { Node } from '@/types/schema';

const props = defineProps({
    synced: {
        type: Boolean,
        required: true,
    },
    node: {
        type: Object as PropType<Node>,
        required: true
    },
    onUpdate: {
        type: Function,
        required: true
    },
    onRemove: {
        type: Function,
        required: true
    }
})

const editMode = ref(false)
const content = computed(() => ({ html: sanitize(starkdown(props.node.content)), raw: props.node.content }))

const handleCancel = () => {
    editMode.value = false
}

const handleChange = (content: string) => {
    props.onUpdate([{ id: props.node.id, content }])
}
</script>

<template>
    <div :class="{ wrapper: true, active: editMode, synced: props.synced }" @dblclick="() => editMode = true">
        <MarkdownEditor v-if="editMode" :value="content.raw" :onChange="handleChange" :autoFocus="true"
            :onCancel="handleCancel" />
        <button v-if="editMode" @click="handleCancel">Done</button>
        <div class="markdown-html" v-html="content.html" v-else />
    </div>
</template>

<style scoped>
div.wrapper {
    position: relative;
    color: black;
    background: rgb(255, 157, 217);
    min-width: 300px;
    min-height: 200px;
    padding: 10px;
    border-radius: 1px;
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.0);
}

div.wrapper.synced {
    background: rgb(155, 109, 224);
}

div.wrapper.active {
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 1.0);
}

button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    z-index: 1;
    cursor: pointer;
}

div.markdown-html {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
}

div.markdown-html> :global(h1),
div.markdown-html> :global(h2),
div.markdown-html> :global(h3),
div.markdown-html> :global(h4),
div.markdown-html> :global(h5),
div.markdown-html> :global(h6) {
    font-weight: 600;
    line-height: 1.3em;
    padding: 0;
    margin: 0;
}
</style>

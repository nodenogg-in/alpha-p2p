<script setup lang="ts">

import { ref, type PropType } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import type { Node } from '@/types/schema';
import MarkdownView from './MarkdownView.vue';

const props = defineProps({
    remote: {
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

const handleCancel = () => {
    editMode.value = false
}

const handleChange = (content: string) => {
    props.onUpdate([{ id: props.node.id, content }])
}
</script>

<template>
    <div :class="{ wrapper: true, active: editMode, remote: props.remote }" @dblclick="() => editMode = true">
        <MarkdownEditor v-if="editMode" :value="props.node.content" :onChange="handleChange" :autoFocus="true"
            :onCancel="handleCancel" />
        <button v-if="editMode" @click="handleCancel">Done</button>
        <MarkdownView :content="props.node.content" v-else />
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

div.wrapper.remote {
    pointer-events: none;
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
</style>

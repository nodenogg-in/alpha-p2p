<script setup lang="ts">

import { ref, type PropType, computed } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import type { Node } from '@/types/schema';
import MarkdownView from './MarkdownView.vue';
import { useAppState } from '@/stores/microcosm';

const app = useAppState()

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

const user = computed(() => app.peerIdentities.get(props.node.identity.uid))

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
        <span v-if="user">{{ user.username || 'Anonymous' }}</span>
        <span v-else>me</span>
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

span {
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 10px;
    opacity: 0.5;
    font-weight: bold;
}
</style>

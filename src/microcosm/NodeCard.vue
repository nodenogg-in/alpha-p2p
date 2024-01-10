<script setup lang="ts">

import { ref, type PropType, computed } from 'vue';
import MarkdownEditor from './MarkdownEditor.vue';
import type { Node } from '@/types/schema';
import MarkdownView from './MarkdownView.vue';
import ContextMenuVue, { type ContextMenuOption } from '@/components/ContextMenu.vue';
import ColorSelectorVue from '@/components/ColorSelector.vue';
import { useAppState } from '@/stores/use-app-state';

const app = useAppState()

const props = defineProps({
    remote: {
        type: Boolean,
        required: true,
    },
    node: {
        type: Object as PropType<Node>,
        required: true
    }
})

const user = computed(() => app.peerIdentities.get(props.node.user_id))

const editMode = ref(false)
const selected = ref(false)

const handleCancel = () => {
    editMode.value = false
}

const handleChange = (markdown: string) => {
    app.updateNode(props.node.id, { markdown })
}

const options: ContextMenuOption[] = [
    {
        type: "button",
        title: "Delete",
        id: "delete",
    },
    {
        type: "button",
        title: "Duplicate",
        id: "duplicate",
    }
]

const handleContextMenu = (action: string) => {
    if (action === 'delete') {
        app.removeNode(props.node.id)
    } else if (action === 'duplicate') {
        app.createNode(props.node.content)
    }
}

const onRemove = () => {
    app.removeNode(props.node.id)
}
</script>

<template>
    <div :class="{
        wrapper: true,
        active: editMode,
        remote: props.remote,
        selected: selected
    }" :style="`background-color: var(--card-${props.node.content.background_color || 'neutral'});`" @dblclick="() => {
    if (!remote) editMode = true
}">
        <MarkdownEditor v-if="editMode" :value="props.node.content.markdown" :onChange="handleChange" :autoFocus="true"
            :onCancel="handleCancel" />
        <button v-if="editMode" @click="handleCancel">Done</button>
        <button v-if="!props.remote" @click="onRemove">Delete</button>
        <ContextMenuVue :options="options" :onClick="handleContextMenu">
            <MarkdownView :content="props.node.content.markdown" v-if="!editMode" />
            <span v-if="user || remote">{{ user?.username || 'Anonymous' }}</span>
            <span v-else>me</span>
            <ColorSelectorVue v-if="!remote" :value="props.node.content.background_color" :onUpdate="(background_color: string) => {
                app.updateNode(props.node.id, { background_color })
            }" />
        </ContextMenuVue>
    </div>
</template>

<style scoped>
div.wrapper {
    position: relative;
    color: black;
    background: var(--card-neutral);
    min-width: 300px;
    min-height: 200px;
    padding: 10px;
    border-radius: 1px;
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.0);
}

div.wrapper.remote {
    background: rgb(155, 109, 224);
}

div.wrapper.active {
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 1.0);
}

div.wrapper.selected {
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.5);
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
@/stores/app
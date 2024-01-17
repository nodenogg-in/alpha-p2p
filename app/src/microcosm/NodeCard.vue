<script setup lang="ts">

import { ref, type PropType, computed } from 'vue';
import type { Node } from '@/types/schema';
import ContextMenuVue, { type ContextMenuOption } from '@/components/ContextMenu.vue';
import ColorSelectorVue from '@/components/ColorSelector.vue';
import HTMLEditor from '@/components/editor/HTMLEditor.vue';
import { useCurrentMicrocosm } from '@/stores/use-microcosm';
import HTMLView from '@/components/HTMLView.vue';

const { data, actions } = useCurrentMicrocosm()

const props = defineProps({
    remote: {
        type: Boolean,
        required: true,
    },
    node: {
        type: Object as PropType<Node>,
        required: true
    },
    user_id: {
        type: String
    }
})

const userIdentity = computed(() => data.users?.get(props.user_id || ''))

const editMode = ref(false)
const selected = ref(false)

const handleCancel = () => {
    editMode.value = false
}

const handleChange = (html: string) => {
    // actions.updateNode(props.node.id, { html })
}

const options: ContextMenuOption[] = [
    {
        type: "button",
        title: "Delete",
        id: "delete",
        disabled: props.remote
    },
    {
        type: "button",
        title: "Duplicate",
        id: "duplicate",
    }
]

const handleContextMenu = (action: string) => {
    if (action === 'delete') {
        // actions.removeNode(props.node.id)
    } else if (action === 'duplicate') {
        // actions.createNode(props.node.content)
    }
}

const onRemove = () => {
    // actions.removeNode(props.node.id)
}
</script>

<template>
    <div :class="{
        wrapper: true,
        active: editMode,
        remote: props.remote,
        selected: selected
    }" :style="`background-color: var(--card-${props.node.background_color || 'neutral'});`" @dblclick="() => {
    if (!remote) editMode = true
}">
        <HTMLEditor v-if="editMode" :value="props.node.html" :onChange="handleChange" autoFocus :onCancel="handleCancel" />
        <ContextMenuVue :options="options" :onClick="handleContextMenu">
            <HTMLView :content="props.node.html" v-if="!editMode" />
            <span v-if="userIdentity || remote">{{ userIdentity?.username || 'Anonymous' }}</span>
            <span v-else>me</span>
            <template v-slot:menu>
                <ColorSelectorVue v-if="!remote" :value="props.node.background_color" :onUpdate="(background_color: string) => {
                    // actions.updateNode(props.node.id, { background_color })
                }" />
            </template>
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
    height: 200px;
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
@/stores/app@/stores/use-microcosm-store
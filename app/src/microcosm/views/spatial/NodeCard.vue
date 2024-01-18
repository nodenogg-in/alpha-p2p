<script setup lang="ts">

import { ref, type PropType } from 'vue';
import type { Identity } from '@/types/schema';
import ContextMenuVue, { type ContextMenuOption } from '@/components/ContextMenu.vue';
import ColorSelectorVue from '@/components/ColorSelector.vue';
import HTMLEditor from '@/components/editor/HTMLEditor.vue';
import { useCurrentMicrocosm, useYNode } from '@/stores/use-microcosm';
import HTMLView from '@/components/HTMLView.vue';
import type { YNode } from '@/utils/yjs/SyncedMicrocosm';

const microcosm = useCurrentMicrocosm()

const props = defineProps({
    node_int: {
        type: Number,
        required: true,
    },
    remote: {
        type: Boolean,
        required: true,
    },
    node: {
        type: Object as PropType<YNode>,
        required: true
    },
    identity: {
        type: Object as PropType<Identity>
    },
})


const editMode = ref(false)
const selected = ref(false)

const handleCancel = () => {
    editMode.value = false
}

const handleChange = (html: string) => {
    microcosm.update(props.node_int, { html })
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

const node = useYNode(props.node)

const handleContextMenu = (action: string) => {
    if (action === 'delete') {
        microcosm.delete(props.node_int)
    } else if (action === 'duplicate') {
        microcosm.create(node.value)
    }
}

</script>

<template>
    <div :class="{
        wrapper: true,
        active: editMode,
        remote: props.remote,
        selected: selected
    }" :style="`background-color: var(--card-${node.background_color || 'neutral'});`" @dblclick="() => {
    if (!remote) editMode = true
}">
        <HTMLEditor v-if="editMode" :value="node.html" :onChange="handleChange" autoFocus :onCancel="handleCancel" />
        <ContextMenuVue :options="options" :onClick="handleContextMenu">
            <HTMLView :content="node.html" v-if="!editMode" />
            <span v-if="remote">{{ identity?.username || 'Anonymous' }}</span>
            <span v-else>{{ identity?.username || 'Anonymous' }}(me)</span>
            <template v-slot:menu>
                <ColorSelectorVue v-if="!remote" :value="node.background_color" :onUpdate="(background_color: string) => {
                    microcosm.update(props.node_int, { background_color })
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
    width: 250px;
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
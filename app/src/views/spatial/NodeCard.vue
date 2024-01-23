<script setup lang="ts">

import { ref, type PropType } from 'vue';
import { type Identity, type HTMLNode } from '@/types/schema';
import ContextMenuVue, { type ContextMenuOption } from '@/components/ContextMenu.vue';
import ColorSelectorVue from '@/components/ColorSelector.vue';
import HTMLEditor from '@/components/editor/HTMLEditor.vue';
import { useCurrentMicrocosm, useYNode } from '@/stores/use-microcosm';
import HTMLView from '@/components/HTMLView.vue';
import type { YHTMLNode } from '@/utils/yjs/SyncedMicrocosm';

const microcosm = useCurrentMicrocosm()

const props = defineProps({
    node_id: {
        type: String,
        required: true,
    },
    remote: {
        type: Boolean,
        required: true,
    },
    node: {
        type: Object as PropType<YHTMLNode>,
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

const handleChange = (content: string) => {
    microcosm.update(props.node_id, { content })
}

const node = useYNode<HTMLNode>(props.node)

</script>

<template>
    <div :class="{
        wrapper: true,
        active: editMode,
        selected: selected
    }" :style="{
    backgroundColor: `var(--card-${node.background_color || 'neutral'})`,
    transform: `translate(${node.x}px, ${node.y}px)`,
    width: `${node.width}px`,
    height: `${node.height}px`
}" @dblclick="() => {
    if (!remote) editMode = true
}">
        <HTMLEditor v-if="editMode" :value="node.content" :onChange="handleChange" autoFocus :onCancel="handleCancel" />
        <HTMLView :content="node.content" v-if="!editMode" />
        <span v-if="remote">{{ identity?.username || 'Anonymous' }}</span>
        <span v-else>{{ identity?.username || 'Anonymous' }}(me)</span>
        <p>{{ node.x }}x{{ node.y }}</p>
        <p>{{ node.width }}x{{ node.height }}</p>
    </div>
</template>

<style scoped>
div.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0% 0%;
    color: black;
    background: var(--card-neutral);
    width: 250px;
    height: 200px;
    border-radius: 10px;
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0.0);
}

div.wrapper.active {
    z-index: 1000;
    box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 1.0);
}

div.wrapper.selected {
    z-index: 1000;
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
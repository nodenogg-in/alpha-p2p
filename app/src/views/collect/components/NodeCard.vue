<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { Node } from 'nodenoggin/schema'

import { useCurrentMicrocosm } from '@/state'
import Editor from '@/components/html/Editor.vue'
import CardContainer from '@/components/CardContainer.vue'

const microcosm = useCurrentMicrocosm()

const props = defineProps({
    node_id: {
        type: String,
        required: true
    },
    remote: {
        type: Boolean,
        required: true
    },
    node: {
        type: Object as PropType<Node<'html'>>,
        required: true
    },
})

const active = ref(false)


const handleCancel = () => {
    active.value = false
}

const handleChange = (content: string) => {
    microcosm.update(props.node_id, {
        type: props.node.type,
        content
    })
}
</script>

<template>
    <CardContainer :data-node_id="node_id" :color="'green'" :active="active" @click="active = true">
        <Editor :editable="active" :content="node.content" :value="node.content" :onChange="handleChange" autoFocus
            :onCancel="handleCancel" />
    </CardContainer>
</template>

<style scoped>
article.card {
    word-break: break-word;
    hyphens: auto;
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: var(--size-16);
    margin-inline: auto;
    min-height: 100px;
}
</style>
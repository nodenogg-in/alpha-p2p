<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { Node } from 'nodenoggin/schema'
import { getColorVar } from 'nodenoggin/ui'

import { useCurrentMicrocosm } from '@/state'
import Editor from '@/components/html/Editor.vue'

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
    <article @focus.prevent :data-node_id="node_id" :class="{
        card: true
    }" :style="{
    backgroundColor: getColorVar(props.node.background_color)

}" @click="active = true">
        <Editor :editable="active" :content="props.node.content" :value="props.node.content" :onChange="handleChange"
            autoFocus :onCancel="handleCancel" />
    </article>
</template>

<style scoped>
article.card {
    word-break: break-word;
    hyphens: auto;
    position: relative;
    width: 100%;
    max-width: 500px;
    font-size: 1.2em;
    margin: var(--size-16) auto;
    min-height: 100px;
    color: var(--ui-mono-0);
    border-radius: var(--ui-radius);
    box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 50%, 0.25);
}

article.card.active {
    z-index: 1000;
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}

article.card.hover {
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}

article.card:focus,
article.card.selected {
    outline: initial;
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}
</style>
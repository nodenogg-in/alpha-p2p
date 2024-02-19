<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { HTMLNode } from 'nodenoggin-core/sync'
import { getColorVar } from 'nodenoggin-core/ui'

import { useCurrentMicrocosm } from '@/state'
import { renderer, editor } from '@/components/html'

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
        type: Object as PropType<HTMLNode>,
        required: true
    },
})

const handleCancel = () => {
    // editMode.value = false
}

const handleChange = (content: string) => {
    microcosm.update(props.node_id, {
        type: props.node.type,
        content
    })
}

const active = ref(false)

</script>

<template>
    <article @focus.prevent :data-node_id="node_id" :class="{
        card: true
    }" :style="{
    backgroundColor: getColorVar(props.node.background_color)
}">
        <component :is="active ? editor : renderer" :content="props.node.content" :value="props.node.content"
            :onChange="handleChange" autoFocus :onCancel="handleCancel" />
    </article>
</template>

<style scoped>
article.card {
    position: relative;
    width: 100%;
    max-width: 500px;
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
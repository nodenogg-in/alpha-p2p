<script setup lang="ts">
import { type PropType, computed } from 'vue'
import type { Identity, Node } from 'nodenoggin/schema'
import { getColorVar } from 'nodenoggin/ui'
import { translate } from 'nodenoggin/spatial'

import Avatar from './Avatar.vue'
import { useCurrentMicrocosm } from '@/state'
import { renderer, editor } from '@/components/html'
import { useCurrentSpatialView } from '@/views/spatial'
import ResizeIndicator from './ResizeIndicator.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

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
  identity: {
    type: Object as PropType<Identity>
  }
})

const active = computed(() => !props.remote && view.editingNode === props.node_id)

const selected = computed(
  () =>
    view.selection.nodes.includes(props.node_id) || view.selectedNodes.includes(props.node_id)
)
const hover = computed(() => view.selection.target === props.node_id)

const handleCancel = () => {
  // editMode.value = false
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
    card: true,
    active,
    selected,
    hover
  }" :style="{
  backgroundColor: getColorVar(props.node.background_color),
  transform: translate(props.node),
  width: `${props.node.width}px`,
  height: `${props.node.height}px`
}">
    <component :is="active ? editor : renderer" :content="props.node.content" :value="props.node.content"
      :onChange="handleChange" autoFocus :onCancel="handleCancel" scroll editable />
    <Avatar :identity="identity" :selected="selected" />
    <ResizeIndicator />
  </article>
</template>

<style scoped>
article.card {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0% 0%;
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

button {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 1;
  cursor: pointer;
}
</style>
<script setup lang="ts">
import { type PropType, computed } from 'vue'
import type { Identity, Node } from 'nodenoggin/schema'

import Avatar from './Avatar.vue'
import { useCurrentMicrocosm } from '@/state'
import { renderer, editor } from '@/components/html'
import { useCurrentSpatialView } from '@/views/spatial'
import ResizeIndicator from './ResizeIndicator.vue'
import CardContainer from '@/components/node/CardContainer.vue'
import Editor from '@/components/html/Editor.vue'

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

const active = computed(() => !props.remote && view.action.editingNode === props.node_id)

const selected = computed(
  () =>
    view.selection.nodes.includes(props.node_id) || view.action.selectedNodes.includes(props.node_id)
)
const hover = computed(() => view.selection.target === props.node_id)

const handleCancel = () => {
  // editMode.value = false
}

const handleChange = (content: string) => {
  console.log('handle change')
  console.log(content)
  microcosm.api().update(props.node_id, {
    type: props.node.type,
    content
  })
}

</script>

<template>
  <CardContainer :data-node_id="node_id" :color="'neutral'" :transform="node" :active="active" :selected="selected"
    :hover="hover">
    <Editor :editable="active" :content="node.content" :value="node.content" :onChange="handleChange"
      :onCancel="handleCancel" />
    <Avatar :identity="identity" :selected="selected" />
    <!-- <ResizeIndicator /> -->
  </CardContainer>
</template>

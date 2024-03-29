<script setup lang="ts">
import { type PropType, computed, onMounted } from 'vue'
import type { Identity, Node, NodeID } from '@nodenogg.in/microcosm'

import Avatar from './Avatar.vue'
import { useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import CardContainer from '@/components/node/CardContainer.vue'
import Editor from '@/components/editor/Editor.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const props = defineProps({
  NodeID: {
    type: String as PropType<NodeID>,
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

const active = computed(() => false)

const selected = computed(() => view.action.selection.boxes.includes(props.NodeID))
const hover = computed(() => view.action.selection.target === props.NodeID)

const handleCancel = () => {
  // editMode.value = false
}

const handleChange = (content: string) => {
  microcosm.api().update<'html'>([props.NodeID, { content }])
}
// onMounted(() => {
//   new Exporter().exportNode('text/html', props.node).then(d => {
//     console.log(d)
//   })
// })
</script>

<template>
  <CardContainer :data-NodeID="NodeID" :color="'neutral'" :transform="node" :active="active" :selected="selected">
    <!-- <h1>
      <pre>
      {{ JSON.stringify({ x: node.x, y: node.y, width: node.width, height: node.height }, null, 2) }}
    </pre>
    </h1> -->
    <Editor :editable="active" :content="node.content" :value="node.content" :onChange="handleChange" scroll
      :onCancel="handleCancel" />
    <Avatar :identity="identity" :selected="selected" />
  </CardContainer>
</template>

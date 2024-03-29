<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { Node } from '@nodenogg.in/microcosm'

import { useCurrentMicrocosm } from '@/state'
import Editor from '@/components/editor/Editor.vue'
import CardContainer from '@/components/node/CardContainer.vue'

const microcosm = useCurrentMicrocosm()

const props = defineProps({
  NodeID: {
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
  }
})

const active = ref(false)

const handleCancel = () => {
  active.value = false
}

const handleChange = (content: string) => {
  microcosm.api().update<'html'>([props.NodeID, { content }])
}
</script>

<template>
  <CardContainer :data-NodeID="NodeID" :color="'green'" :active="active" @click="active = true">
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
  max-width: 720px;
  margin: var(--size-16);
  margin-inline: auto;
  min-height: 100px;
}
</style>
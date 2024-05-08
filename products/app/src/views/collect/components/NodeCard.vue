<script setup lang="ts">
import { type PropType, ref } from 'vue'
import type { Entity, EntityID } from '@nodenogg.in/microcosm'

import { useCurrentMicrocosm } from '@/state'
import Editor from '@/components/editor/Editor.vue'
import CardContainer from '@/components/node/CardContainer.vue'

const microcosm = useCurrentMicrocosm()

const props = defineProps({
  entity_id: {
    type: String as unknown as PropType<EntityID>,
    required: true
  },
  remote: {
    type: Boolean,
    required: true
  },
  entity: {
    type: Object as PropType<Entity<'html'>>,
    required: true
  }
})

const active = ref(false)

const handleCancel = () => {
  active.value = false
}

const handleChange = (content: string) => {
  microcosm.api().update(props.entity_id, { content })
}
</script>

<template>
  <CardContainer :data-entity_id="entity_id" :color="'green'" :active="active" @click="active = true">
    <Editor :editable="active" :content="entity.body" :value="entity.body" :onChange="handleChange" autoFocus
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
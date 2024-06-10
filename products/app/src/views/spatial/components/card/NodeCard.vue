<script setup lang="ts">
import { type PropType, computed, onMounted } from 'vue'
import type { EntityID, Identity, IdentityID } from '@nodenogg.in/microcosm'

import Avatar from './Avatar.vue'
import { useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import CardContainer from '@/components/node/CardContainer.vue'
import Editor from '@/components/editor/Editor.vue'

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()

const props = defineProps({
  entity_id: {
    type: String as PropType<EntityID>,
    required: true
  },
  identity_id: {
    type: String as PropType<IdentityID>,
    required: true
  },
  remote: {
    type: Boolean,
    required: true
  },
  identity: {
    type: Object as PropType<Identity>
  }
})

const active = computed(() => false)

const selected = computed(() => view.action.selection.boxes.includes(props.entity_id))
const hover = computed(() => view.action.selection.target === props.entity_id)

const handleCancel = () => {
  // editMode.value = false
}

const handleChange = (body: string) => {
  microcosm.api.update(props.entity_id, { body })
}

</script>

<template>
  <CardContainer :data-entity_id="entity_id" :color="'neutral'" :transform="entity" :active="active"
    :selected="selected">
    <!-- <h1>
      <pre>
      {{ JSON.stringify({ x: node.x, y: node.y, width: node.width, height: node.height }, null, 2) }}
    </pre>
    </h1> -->
    <Editor :editable="active" :content="entity.body" :value="entity.body" :onChange="handleChange" scroll
      :onCancel="handleCancel" />
    <Avatar :identity="identity" :selected="selected" />
  </CardContainer>
</template>

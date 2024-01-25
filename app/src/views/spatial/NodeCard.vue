<script setup lang="ts">
import { ref, type PropType, computed } from 'vue'
import { type Identity, type HTMLNode } from '@/microcosm/types/schema'
import HTMLEditor from '@/components/editor/HTMLEditor.vue'
import { useCurrentMicrocosm, useYNode } from '@/microcosm/stores/microcosm'
import HTMLView from '@/components/HTMLView.vue'
import type { YHTMLNode } from '@/utils/yjs/SyncedMicrocosm'
import { useCurrentSpatialView } from './stores/use-spatial-view'

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
    type: Object as PropType<YHTMLNode>,
    required: true
  },
  identity: {
    type: Object as PropType<Identity>
  }
})

const editMode = ref(false)
const selected = computed(
  () =>
    view.selection.point === props.node_id || view.selection.selection.nodes.includes(props.node_id)
)

const handleCancel = () => {
  editMode.value = false
}

const handleChange = (content: string) => {
  microcosm.update(props.node_id, { content })
}

const node = useYNode<HTMLNode>(props.node)
</script>

<template>
  <div
    @focus.prevent
    tabindex="0"
    :data-node_id="node_id"
    :class="{
      wrapper: true,
      active: editMode,
      selected: selected
    }"
    :style="{
      backgroundColor: `var(--card-${node.background_color || 'neutral'})`,
      transform: `translate(${node.x}px, ${node.y}px)`,
      width: `${node.width}px`,
      height: `${node.height}px`
    }"
    @dblclick="
      () => {
        if (!remote) editMode = true
      }
    "
  >
    <HTMLEditor
      v-if="editMode"
      :value="node.content"
      :onChange="handleChange"
      autoFocus
      :onCancel="handleCancel"
    />
    <HTMLView :content="node.content" v-if="!editMode" />
    <span v-if="remote">{{ identity?.username || 'Anonymous' }}</span>
    <span v-else>{{ identity?.username || 'Anonymous' }}(me)</span>
    <!-- <p>{{ props.node_id }}</p> -->
    <!-- <p>{{ node.x }}x{{ node.y }}</p> -->
    <!-- <p>{{ node.width }}x{{ node.height }}</p> -->
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
  border-radius: 2px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

div.wrapper.active {
  z-index: 1000;
  box-shadow: 0 0 0 2px rgba(50, 40, 255, 0.25);
}

div.wrapper:focus,
div.wrapper.selected {
  outline: initial;
  box-shadow: 0 0 0 2px rgba(50, 40, 255, 0.5);
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
@/microcosm/types/schema@/microcosm/stores/microcosm
@/microcosm/yjs/SyncedMicrocosm
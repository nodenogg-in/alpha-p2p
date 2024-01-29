<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { type Identity, type HTMLNode } from '@/microcosm/types/schema'
import HTMLEditor from '@/components/editor/HTMLEditor.vue'
import { useCurrentMicrocosm, useYNode } from '@/microcosm/stores'
import HTMLView from '@/components/HTMLView.vue'
import type { YHTMLNode } from '@/microcosm/yjs/SyncedMicrocosm'
import { useCurrentSpatialView } from '@/views/spatial'
import { translate } from './utils/css'
import { getColorVar } from '@/utils/css-variables'

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

const active = computed(() => !props.remote && view.editingNode === props.node_id)

const selected = computed(
  () =>
    view.selection.selection.nodes.includes(props.node_id) || view.selectedNodes.includes(props.node_id)
)
const hover = computed(() => view.selection.point === props.node_id)

const handleCancel = () => {
  // editMode.value = false
}

const handleChange = (content: string) => {
  microcosm.update(props.node_id, { content })
}

const node = useYNode<HTMLNode>(props.node)
</script>

<template>
  <div @focus.prevent :data-node_id="node_id" :class="{
    wrapper: true,
    active,
    selected,
    hover
  }" :style="{
  backgroundColor: getColorVar(node.background_color),
  transform: translate(node),
  width: `${node.width}px`,
  height: `${node.height}px`
}">
    <HTMLEditor v-if="active" :value="node.content" :onChange="handleChange" autoFocus :onCancel="handleCancel" />
    <HTMLView :content="node.content" v-if="!active" />
    <span>
      <p>{{ identity?.username || 'Anonymous' }}</p>
    </span>
  </div>
</template>

<style scoped>
div.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0% 0%;
  color: var(--ui-mono-0);
  background: var(--card-neutral);
  border-radius: var(--ui-radius);
  box-shadow: var(--ui-card-shadow)
}

div.wrapper.active {
  z-index: 1000;
  box-shadow: 0 0 0 2px var(--ui-accent-100);
}

div.wrapper.hover {
  box-shadow: 0 0 0 2px var(--ui-accent-100);

}

div.wrapper:focus,
div.wrapper.selected {
  outline: initial;
  box-shadow: 0 0 0 2px var(--ui-accent-100);
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
  bottom: 0;
  left: 0;
  padding: 5px;
  font-size: 8px;
  opacity: 0.5;
  font-weight: bold;
  transform-origin: 0% 100%;
  transform: scale(calc(1.0 / var(--spatial-view-scale)));
}
</style>

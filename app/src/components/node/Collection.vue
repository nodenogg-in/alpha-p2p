<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useApp, useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import type { Identity_UID } from '@nodenogg.in/microcosm'

const app = useApp()
const microcosm = useCurrentMicrocosm()
const spatial = useCurrentSpatialView()

const props = defineProps({
  identity_uid: {
    type: String as PropType<Identity_UID>,
    required: true
  }
})

const nodes = spatial.useCollection(props.identity_uid)
const identity = computed(() => microcosm.getUser(props.identity_uid))
</script>

<template>
  <slot v-for="[node_id, node] in nodes" v-bind:key="`${node_id}-node-${identity_uid}`"
    :remote="app.identity.identity_uid !== identity_uid" :identity="identity" :node_id="node_id" :node="node">
  </slot>
</template>
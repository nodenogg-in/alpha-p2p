<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useApp, useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import type { IdentityID } from '@nodenogg.in/microcosm'

const app = useApp()
const microcosm = useCurrentMicrocosm()
const spatial = useCurrentSpatialView()

const props = defineProps({
  identityID: {
    type: String as PropType<IdentityID>,
    required: true
  }
})

const nodes = spatial.useCollection(props.identityID)
const identity = computed(() => microcosm.getUser(props.identityID))
</script>

<template>
  <slot v-for="[nodeID, node] in nodes" v-bind:key="`${nodeID}-node-${identityID}`"
    :remote="app.identity.identityID !== identityID" :identity="identity" :nodeID="nodeID" :node="node">
  </slot>
</template>
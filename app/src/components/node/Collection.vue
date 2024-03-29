<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useApp, useCurrentMicrocosm } from '@/state'
import { useCurrentSpatialView } from '@/views/spatial'
import type { IdentityID } from '@nodenogg.in/microcosm'

const app = useApp()
const microcosm = useCurrentMicrocosm()
const spatial = useCurrentSpatialView()

const props = defineProps({
  IdentityID: {
    type: String as PropType<IdentityID>,
    required: true
  }
})

const nodes = spatial.useCollection(props.IdentityID)
const identity = computed(() => microcosm.getUser(props.IdentityID))
</script>

<template>
  <slot v-for="[NodeID, node] in nodes" v-bind:key="`${NodeID}-node-${IdentityID}`"
    :remote="app.identity.IdentityID !== IdentityID" :identity="identity" :NodeID="NodeID" :node="node">
  </slot>
</template>
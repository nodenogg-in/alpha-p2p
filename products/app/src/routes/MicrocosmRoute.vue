<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'
import Panel from '@/microcosm/Panel.vue'

const data = useAppRouter()
</script>

<template>
  <Panel>
    <Microcosm v-if="data.microcosmID" :microcosmID="data.microcosmID" v-bind:key="`main/${data.microcosmID}`" id="main"
      ui />
  </Panel>

  <Panel inset width="36%" height="50%" :x="0" :y="0" v-for="(microcosmID, i) in data.subviews"
    v-bind:key="`${microcosmID}1`">
    <Microcosm :microcosmID="microcosmID" :id="`${data.microcosmID}/${i}1`" />
  </Panel>
</template>
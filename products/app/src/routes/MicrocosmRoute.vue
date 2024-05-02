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
  <!-- <Panel inset width="300px" height="250px" :x="10" :y="60" v-for="(microcosmID, i) in data.subviews"
    v-bind:key="microcosmID">
    <Microcosm :microcosmID="microcosmID" :id="`${data.microcosmID}/${i}`" />
  </Panel> -->
</template>
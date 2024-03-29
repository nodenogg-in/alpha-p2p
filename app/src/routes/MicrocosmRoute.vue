<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'
import Panel from '@/microcosm/Panel.vue'

const data = useAppRouter()
</script>

<template>
  <Panel>
    <Microcosm v-if="data.MicrocosmID" :MicrocosmID="data.MicrocosmID" v-bind:key="`main/${data.MicrocosmID}`"
      id="main" ui />
  </Panel>
  <Panel inset width="300px" height="250px" :x="10" :y="60" v-for="(MicrocosmID, i) in data.subviews"
    v-bind:key="MicrocosmID">
    <Microcosm :MicrocosmID="MicrocosmID" :id="`${data.MicrocosmID}/${i}`" />
  </Panel>
</template>
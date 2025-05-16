<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'
import Panel from '@/microcosm/Panel.vue'

const data = useAppRouter()
</script>

<template>
  <Panel inset width="100%" height="100%">
    <Microcosm v-if="data.microcosmUUID" :microcosmUUID="data.microcosmUUID" v-bind:key="`main/${data.microcosmUUID}`" id="main"
      ui />
  </Panel>

  <Panel inset width="50%" height="100%" :x="645" :y="0" v-for="(microcosmUUID, i) in data.subviews"
    v-bind:key="`${microcosmUUID}1`">
    <Microcosm :microcosmUUID="microcosmUUID" :id="`${data.microcosmUUID}/${i}1`" />
  </Panel>
</template>
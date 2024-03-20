<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'
import Panel from '@/microcosm/Panel.vue';

const data = useAppRouter()
</script>

<template>
  <Panel>
    <Microcosm navigation v-if="data.microcosm_uri" :microcosm_uri="data.microcosm_uri"
      v-bind:key="`main/${data.microcosm_uri}`" :id="`${data.microcosm_uri}/main`" />
  </Panel>
  <Panel inset width="500px" height="300px" :x="10" :y="10">
    <Microcosm navigation v-for="(microcosm_uri, i) in data.subviews" v-bind:key="microcosm_uri"
      :microcosm_uri="microcosm_uri" :id="`${data.microcosm_uri}/${i}`" />
  </Panel>
</template>

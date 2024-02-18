<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'

const data = useAppRouter()
</script>

<template>
  <Microcosm primary v-if="data.main" :view="data.main.view" :microcosm_uri="data.main.microcosm_uri"
    v-bind:key="`${data.main.microcosm_uri}/${data.main.view}`" />
  <!-- <Microcosm v-for="subview in data.subviews" v-bind="subview" v-bind:key="subview.microcosm_uri" /> -->
</template>

<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/hooks/use-route-microcosms'
import { Microcosm } from '@/microcosm/core'

const data = useRouteMicrocosms()
</script>

<template>
  <Microcosm primary v-if="data.main" :view="data.main.view" :microcosm_uri="data.main.microcosm_uri"
    v-bind:key="data.main.microcosm_uri" />
  <!-- <Microcosm v-for="subview in data.subviews" v-bind="subview" v-bind:key="subview.microcosm_uri" /> -->
</template>

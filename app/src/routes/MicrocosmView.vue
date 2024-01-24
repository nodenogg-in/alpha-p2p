<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/use-route-microcosms'
import { Microcosm } from '@/microcosm/core'
import { computed } from 'vue'
const microcosms = useRouteMicrocosms()
const spacing = computed(() => (microcosms.value.length > 1 ? 20 : 20))
</script>

<template>
  <section
    class="panel-container"
    :style="{
      padding: `${spacing}px`,
      gridColumnGap: `${spacing}px`,
      gridTemplateColumns: `repeat(${microcosms.length}, 1fr)`
    }"
  >
    <Microcosm
      :microcosm_uri="microcosm_uri"
      v-for="microcosm_uri in microcosms"
      v-bind:key="microcosm_uri"
    />
  </section>
</template>

<style scoped>
.panel-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(auto-fill, 100%);
}
</style>

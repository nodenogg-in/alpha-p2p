<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/hooks/use-route-microcosms'
import { Microcosm } from '@/microcosm/core'
import { useApp } from '@/microcosm/stores';

const data = useRouteMicrocosms()
const app = useApp()
</script>

<template>
  <section class="panel-container" v-if="data.view" :style="{
    gridTemplateColumns: `repeat(${data.microcosm_uris.length}, 1fr)`
  }" :class="{ open: app.menuOpen }">
    <Microcosm :view="data.view" :microcosm_uri="microcosm_uri" v-for="microcosm_uri in data.microcosm_uris"
      v-bind:key="microcosm_uri" />
  </section>
</template>

<style scoped>
.panel-container {
  position: absolute;
  top: 0;
  z-index: 2;
  left: 0;
  transform: translateX(0);
  width: 100%;
  height: 100vh;
  display: grid;
  background: rgb(220, 220, 220);
  padding-left: 1px;
  grid-column-gap: 1px;
  grid-template-rows: repeat(auto-fill, 100%);
  transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), width 0.4s cubic-bezier(0.33, 1, 0.68, 1);
}

.panel-container.open {
  transform: translateX(var(--app-menu-width));
  width: calc(100% - var(--app-menu-width));

}
</style>

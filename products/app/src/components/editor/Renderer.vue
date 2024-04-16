<script setup lang="ts">
import Scrollable from './Scrollable.vue'

defineProps({
  value: {
    type: String,
    default: ''
  },
  scroll: {
    type: Boolean
  }
})
</script>

<template>
  <Scrollable class="html" :html="value" v-html="value" :active="scroll" />
</template>

<style scoped>
div.html {
  padding: var(--size-12);
  margin: 0;
}
</style>

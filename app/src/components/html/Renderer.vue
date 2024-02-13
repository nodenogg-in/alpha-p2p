<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeHTML } from 'nodenoggin-core/utils'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const content = computed(() => sanitizeHTML(props.value))
</script>

<template>
  <div :class="{ html: true, scrollable: true }" v-html="content" />
</template>

<style scoped>
div.html {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  line-height: 1.4em;
  margin: 0;
  overflow-y: scroll;
}
</style>
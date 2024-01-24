<script setup lang="ts">
import { computed } from 'vue'
import { sanitize } from '../utils/html'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const content = computed(() => sanitize(props.content))
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

/* width */
div.html > :global(h1),
div.html > :global(h2),
div.html > :global(h3),
div.html > :global(h4),
div.html > :global(h5),
div.html > :global(h6) {
  font-weight: 600;
  line-height: 1.2em;
  padding: 0;
  margin: 0;
}

div.html > :global(h1) {
  font-size: 32px;
  line-height: 1em;
}

div.html > :global(h2) {
  font-size: 28px;
}

div.html > :global(h3) {
  font-size: 24px;
}

div.html > :global(h4) {
  font-size: 20px;
}

div.html > :global(h5) {
  font-size: 18px;
}

div.html > :global(h6) {
  font-size: 16px;
}

div.html > :global(strong) {
  font-weight: 700;
}

div.html > :global(p) {
  line-height: 1.4em;
  padding: 0;
  margin: 0;
}

div.html > :global(hr) {
  border: initial;
  border-top: 1px solid currentColor;
}
</style>

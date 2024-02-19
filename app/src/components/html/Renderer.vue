<script setup lang="ts">
import Scrollable from './Scrollable.vue';

const props = defineProps({
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
  <Scrollable class="html" :html="props.value" v-html="props.value" :active="props.scroll" />
</template>

<style scoped>
div.html {
  padding: var(--size-12);
  margin: 0;
}
</style>
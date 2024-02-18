<script setup lang="ts">
import Scrollable from './Scrollable.vue';

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <Scrollable class="html" :html="props.value" v-html="props.value" />
</template>

<style scoped>
div.html {
  padding: var(--size-12);
  margin: 0;
}
</style>
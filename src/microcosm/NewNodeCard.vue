<script setup lang="ts">
import { ref } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
})

const message = ref<string>('')

const handleSubmit = () => {
  if (message.value) {
    props.onSubmit(message.value)
    message.value = ''
  }
}

document.addEventListener('keydown', (event) => {
  if (event.metaKey && event.key == 'Enter') {
    handleSubmit()
  }
})
</script>

<template>
  <div>
    <MarkdownEditor :value="message" :onChange="(v: string) => (message = v)" />
    <button @click="handleSubmit">Add</button>
  </div>
</template>

<style scoped>
div {
  position: relative;
  display: block;
  width: 300px;
  height: 200px;
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px dashed black;
}

button {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 1;
  cursor: pointer;
}
</style>

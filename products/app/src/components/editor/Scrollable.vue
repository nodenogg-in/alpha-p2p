<script lang="ts" setup>
defineProps({
  htmlTag: {
    type: String,
    default: 'div'
  },
  scroll: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <component :is="htmlTag" :class="{ scroll, container: true, ui: true }" v-bind="$attrs">
    <slot></slot>
  </component>
</template>

<style scoped>
.container {
  word-break: break-word;
  hyphens: auto;
  width: 100%;
  height: 100%;
  font-size: 1.1em;
}

.container.scroll {
  scroll-behavior: smooth;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.container::-webkit-scrollbar {
  width: 6px;
}

.container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

.container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 3px;
}

.container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 1);
}

@media (prefers-color-scheme: dark) {
  .container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
  }

  .container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 1);
  }
}
</style>

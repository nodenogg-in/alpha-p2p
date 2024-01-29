<script setup lang="ts">
import Tooltip from './Tooltip.vue';

const props = defineProps({
  active: {
    type: Boolean
  },
  keyCommand: {
    type: String
  },
  tooltip: {
    type: String,
    required: true
  },
  showCommand: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  click: [e: Event]
}>()
</script>

<template>
  <Tooltip :keyCommand="props.keyCommand" :tooltip="props.tooltip">
    <button :class="{ active, 'icon-button': true }" @click="(e) => $emit('click', e)">
      <slot></slot>
    </button>
  </Tooltip>
</template>

<style>
.icon-button {
  position: relative;
  font-family: inherit;
  height: 50px;
  width: 50px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-0);
  cursor: pointer;
}

.icon-button>svg {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  transform: scale(1) rotate(0deg);
}

.icon-button.active {
  z-index: 2;
  color: var(--ui-100);
  background-color: var(--ui-accent-100);
}

.icon-button.active>svg {
  transform: scale(1.1) rotate(0deg);
}

.icon-button:hover:not(.active) {
  background-color: var(--ui-accent-10);
  color: var(--ui-accent-100);
}

.icon-button:hover>svg {
  transform: translateY(-3px) scale(1.1) rotate(10deg);
}

.icon-button:focus {
  box-shadow: 0 0 0 2px var(--ui-accent-100);
}
</style>

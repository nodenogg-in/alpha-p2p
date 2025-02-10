<script setup lang="ts">
import type { PropType } from 'vue'
import Tooltip from './Tooltip.vue'

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
  <Tooltip :command="props.keyCommand" :tooltip="props.tooltip">
    <button :class="{ active, 'icon-button': true }" @click="(e) => $emit('click', e)">
      <slot></slot>
    </button>
  </Tooltip>
</template>

<style>
.icon-button {
  position: relative;
  font-family: inherit;
  height: var(--size-48);
  width: var(--size-48);
  font-weight: 500;
  border-radius: var(--size-24  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-0);
  cursor: pointer;
}

.icon-button>svg {
  transform-origin: 50% 0%;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  transform: scale(1) rotate(0deg);
}

.icon-button.active {
  z-index: 2;
  background-color: var(--ui-primary-20);
  color: var(--ui-primary-100);
}

.icon-button.active>svg {
  transform: scale(1.1) rotate(0deg)
}

.icon-button:hover:not(.active) {
  color: var(--ui-100);
  background-color: var(--ui-primary-100);
}

.icon-button:hover>svg {
  transform: translateY(-2px) scale(1.1) rotate(10deg);
}

.icon-button:focus {
  box-shadow: 0 0 0 var(--ui-weight) var(--ui-primary-100);
}
</style>

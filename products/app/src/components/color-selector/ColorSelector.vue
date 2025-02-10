<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'
import { type PropType } from 'vue'
import { cardColors, getCardColor } from '@nodenogg.in/app'

defineProps({
  onUpdate: {
    type: Function as PropType<(color: string) => void>,
    required: true
  },
  value: {
    type: String
  }
})
</script>

<template>
  <div>
    <ToggleGroupRoot :model-value="value" @update:modelValue="onUpdate" class="ui toggle-group">
      <ToggleGroupItem
        v-for="color in cardColors"
        :value="color"
        :aria-label="`Change color to ${color}`"
        class="toggle-group-item"
        v-bind:key="`color${color}`"
        :style="`background-color: ${getCardColor(50, color)};`"
      >
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
</template>

<style scoped>
button {
  all: unset;
}

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: var(--size-8) var(--size-8);
  overflow-x: scroll;
  width: 100%;
  color: var(--ui-0);
  justify-content: flex-start;
  border-radius: var(--ui-radius);
}

.toggle-group:hover {
  background: var(--ui-90);
}

@media (prefers-color-scheme: dark) {
  .toggle-group {
    /* background-color: var(--ui-90); */
  }

  .toggle-group:hover {
    background: var(--ui-80);
  }
}

.toggle-group-item {
  flex-shrink: 0;
  cursor: pointer;
  margin: var(--size-2);
  height: var(--size-24);
  width: var(--size-24);
  border-radius: var(--size-24);
  line-height: 1;
  align-items: center;
  justify-content: center;
  transform: scale(0.75);
  position: relative;
}

.toggle-group-item:hover {
  box-shadow: var(--ui-shadow-10);
}

.toggle-group-item[data-state='on'] {
  transform: scale(1);
  box-shadow: var(--ui-shadow-100);
}

.toggle-group-item:focus {
  box-shadow: var(--ui-shadow-100);
}
</style>

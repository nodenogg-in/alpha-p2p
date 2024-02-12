<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'
import { type PropType } from 'vue'
import * as colors from 'nodenoggin-core/theme'
import { colorName } from 'nodenoggin-core/utils';

const props = defineProps({
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
    <ToggleGroupRoot :model-value="props.value" @update:modelValue="props.onUpdate" class="toggle-group">
      <ToggleGroupItem v-for="color in Object.keys(colors)" :value="color" :aria-label="`Change color to ${color}`"
        class="toggle-group-item" v-bind:key="`color${color}`" :style="`background-color: var(${colorName(color)});`">
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
</template>

<style scoped>
button {
  all: unset;
}

.toggle-group {
  display: inline-flex;
  padding: 10px;
}

.toggle-group-item {
  cursor: pointer;
  margin: 2px;
  height: 24px;
  width: 24px;
  border-radius: 12px;
  display: flex;
  font-size: 15px;
  line-height: 1;
  align-items: center;
  justify-content: center;
  transform: scale(0.75);
}

.toggle-group-item:hover {
  box-shadow: 0px 0px 0px 2px rgba(1, 1, 1, 0.25);
}

.toggle-group-item[data-state='on'] {
  transform: scale(1);
  box-shadow: 0px 0px 0px 2px rgba(1, 1, 1, 1);
}

.toggle-group-item:focus {
  position: relative;
  box-shadow: 0 0 0 2px black;
}
</style>

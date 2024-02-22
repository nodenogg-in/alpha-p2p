<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'
import { type PropType } from 'vue'
<<<<<<< HEAD
import { cardColors, getCardColor } from 'nodenoggin/app'

defineProps({
  onUpdate: {
    type: Function as PropType<(color: string) => void>,
    required: true
  },
  value: {
    type: String
  }
=======
import { colors as presetColors } from '../constants/colors'


const props = defineProps({
    colors: {
        type: Array as PropType<string[]>,
        default: presetColors
    },
    onUpdate: {
        type: Function as PropType<(color: string) => void>,
        required: true
    },
    value: {
        type: String
    }
>>>>>>> 251788f (switched to monorepo)
})
</script>

<template>
<<<<<<< HEAD
  <div>
    <ToggleGroupRoot :model-value="value" @update:modelValue="onUpdate" class="ui toggle-group">
      <ToggleGroupItem v-for="color in cardColors" :value="color" :aria-label="`Change color to ${color}`"
        class="toggle-group-item" v-bind:key="`color${color}`" :style="`background-color: ${getCardColor(50, color)};`">
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
  background-color: var(--ui-90);
  justify-content: flex-start;
  border-bottom: 1px solid var(--ui-80);
}

@media (prefers-color-scheme: dark) {
  .toggle-group {
    background-color: var(--ui-90);
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
  box-shadow: var(--ui-shadow-10)
}

.toggle-group-item[data-state='on'] {
  transform: scale(1);
  box-shadow: var(--ui-shadow-100);
}

.toggle-group-item:focus {
  box-shadow: var(--ui-shadow-100);
}
</style>
=======
    <div>
        <ToggleGroupRoot :model-value="props.value" @update:modelValue="props.onUpdate" class="toggle-group">
            <ToggleGroupItem v-for="color in props.colors" :value="color" :aria-label="`Change color to {color}`"
                class="toggle-group-item" v-bind:key="`color${color}`" :style="`background-color: var(--card-${color});`">
            </ToggleGroupItem>
        </ToggleGroupRoot>
    </div>
</template>

<style scoped>
div {}

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
    transform: scale(1.0);
    box-shadow: 0px 0px 0px 2px rgba(1, 1, 1, 1);
}

.toggle-group-item:focus {
    position: relative;
    box-shadow: 0 0 0 2px black;
}
</style>
>>>>>>> 251788f (switched to monorepo)

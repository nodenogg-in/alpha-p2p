<script lang="ts" setup>
import { SelectItem, SelectItemIndicator, SelectItemText } from 'radix-vue'

defineProps({
  text: {
    type: String,
    required: true
  },
  value: {
    type: String
  }
})
</script>

<template>
  <SelectItem v-bind="$attrs" class="select-item" :value="value || text">
    <SelectItemIndicator class="select-item-indicator">
      <!-- <Icon type="move" /> -->
    </SelectItemIndicator>
    <SelectItemText>
      {{ text }}
    </SelectItemText>
  </SelectItem>
</template>

<style>
.select-item {
  line-height: 1;
  border-radius: var(--ui-radius);
  display: flex;
  align-items: center;
  height: var(--size-32);
  position: relative;
  user-select: none;
  width: 100%;
  padding: 0 var(--size-8);
  cursor: pointer;
}

.select-item[data-state='checked'] {
  background-color: var(--ui-primary-40);
}

.select-item[data-highlighted] {
  outline: none;
  color: var(--ui-mono-100);
  background-color: var(--ui-primary-100);
}

.select-item-indicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

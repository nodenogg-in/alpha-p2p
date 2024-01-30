<script setup lang="ts">
import { type PropType } from 'vue'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuSeparator
} from 'radix-vue'

export type ContextMenuOption = {
  type: 'button'
  id: string
  title: string
  command?: string
  disabled?: boolean
  separator?: boolean
}

const emit = defineEmits<{
  (e: 'change', id: string): void
}>()

const props = defineProps({
  onToggle: {
    type: Function as PropType<(open: boolean) => void>
  },
  options: {
    type: Array as PropType<ContextMenuOption[]>,
    required: true
  }
})
</script>

<template>
  <ContextMenuRoot :modal="true">
    <ContextMenuTrigger as-child>
      <slot></slot>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent :class="{ 'menu-context': true }" :side-offset="5">
        <ContextMenuItem :value="'color'">
          <slot name="menu"></slot>
        </ContextMenuItem>
        <ContextMenuItem v-for="option in props.options" :value="option.id" class="context-menu-item" :key="option.id"
          @click="emit('change', option.id)" :disabled="option.disabled">
          {{ option.title }}
          <div v-if="option.command" class="right-slot">
            {{ option.command }}
          </div>
          <ContextMenuSeparator class="separator" v-if="option.separator" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<style>
.menu-context {
  z-index: 500;
  min-width: 180px;
  border-radius: var(--ui-radius);
  overflow: hidden;
  background: var(--ui-100);
  padding: 4px;
  box-shadow: var(--ui-shadow);
}

@media (prefers-color-scheme: dark) {
  .menu-context {
    background: var(--ui-90);
  }
}

.context-menu-item {
  border-radius: var(--ui-radius);
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 5px;
  position: relative;
  user-select: none;
  outline: none;
  border-radius: var(--ui-radius);
  cursor: pointer;
}

.context-menu-item[data-disabled] {
  opacity: 0.1;
  pointer-events: none;
}

.context-menu-item[data-highlighted] {
  background: var(--ui-primary-30);
  color: var(--ui-0);
}

.separator {
  height: 1px;
  background-color: var(--grass-6);
  margin: 5px;
}

.right-slot {
  margin-left: auto;
  padding-left: 20px;
  color: var(--ui-60);
  font-size: 10px;
}

[data-highlighted]>.right-slot {
  color: currentColor;
}

[data-disabled] .right-slot {
  color: var(--mauve-8);
}
</style>

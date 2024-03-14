<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger
} from 'radix-vue'
</script>

<template>
  <ContextMenuRoot :modal="true">
    <ContextMenuTrigger as-child>
      <slot></slot>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent :class="{ 'menu-context': true }" :side-offset="5">
        <slot name="menu"></slot>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<style>
.menu-context {
  z-index: 500;
  min-width: 180px;
  max-width: 220px;
  border-radius: var(--ui-radius);
  overflow: hidden;
  background: var(--ui-100);
  box-shadow: var(--ui-shadow-10);
  padding: var(--size-2);
}

@media (prefers-color-scheme: dark) {
  .menu-context {
    background: var(--ui-90);
  }
}

[data-highlighted] > .right-slot {
  color: currentColor;
}

[data-disabled] .right-slot {
  color: var(--mauve-8);
}
</style>

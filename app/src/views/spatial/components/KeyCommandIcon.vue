<template>
  <span class="command" v-bind="$attrs">
    <slot></slot>
  </span>
</template>

<style scoped>
.command {
  text-transform: uppercase;
  color: var(--ui-70);
  font-weight: 600;
}
</style>

<template>
  <span class="command" v-bind="$attrs">
    <slot></slot>
  </span>
</template>

<style scoped>
.command {
  text-transform: uppercase;
  background-color: var(--ui-60);
  color: var(--ui-10);
  padding: 0.2em 0.36em 0.36em 0.36em;
  font-weight: 600;
  border-radius: 0.36em;
  font-size: 0.75em;
  position: relative;
  box-shadow: inset 0 -0.18em var(--ui-40);
  width: fit-content;
  display: inline-block;
  transform: translateY(-0.02em);
}
</style>

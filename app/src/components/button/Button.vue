<template>
  <button v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  width: fit-content;
  cursor: pointer;
  color: var(--ui-0);
  /* background: var(--ui-100); */
  height: var(--size-32);
  padding: 0 var(--size-8);
  display: flex;
  align-items: center;
  user-select: none;
  font-weight: 500;
  position: relative;
  border-radius: var(--ui-radius);
}

button.outline {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  button {
    background: var(--ui-90);
  }
}

button:has(> svg) {
  /* padding-left: 2px; */
}

button :global(> svg) {
  /* margin-right: 5px; */
}

button:hover {
  color: var(--ui-100);
  background: var(--ui-primary-100);
}

button:focus {
  box-shadow: var(--ui-shadow-primary);
}
</style>

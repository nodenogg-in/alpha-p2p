
<template>
  <div class="canvas-surface" role="presentation">
    <section class="canvas-background">
      <slot></slot>
    </section>
  </div>
</template>

<style scoped>
.canvas-surface {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-origin: 50% 50%;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform: translate(var(--spatial-view-translate-x), var(--spatial-view-translate-y)) scale(var(--spatial-view-scale));
}

.canvas-background {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>

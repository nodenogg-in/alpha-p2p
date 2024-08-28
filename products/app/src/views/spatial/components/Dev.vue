<script lang="ts" setup>
import { boxStyle } from '@figureland/infinitykit'
// import { useSubscribable } from '@figureland/kit/state/vue';
import { useCurrentSpatialView } from '..'
import { animated, app } from '@/state';
import { getScale } from '@figureland/kit/math/matrix2D';
import { lerp as lerpVec2 } from '@figureland/kit/math/vector2'
const view = useCurrentSpatialView()


// const canvasContainer = useSubscribable(signal((get) => {
//   get(view.interaction.transform)
//   const box = view.interaction.screenToCanvas(get(view.interaction.viewport))
//   return boxStyle({ ...box, width: box.width * 0.5, height: box.height })
// }))

// const style = useDerived((get) => {
//   get(view.interaction.transform)
//   const pointer = get(app.pointer)
//   const xy = view.interaction.screenToCanvas(pointer.point)
//   return `transform: translate(${xy.x}px, ${xy.y}px) scale(calc(${pointer.active ? 1.0 : 0.75} * var(--card-element-scale)));`
// })

// const demoBox = signal(get => {

//   const s = getScale(get(view.infinitykit.canvas.transform))
//   const b = {
//     x: 400,
//     y: 320,
//     width: 300,
//     height: 200
//   }
//   const p = view.infinitykit.canvas.screenToCanvas(b)
//   return `${boxStyle(p)}; background-color: rgb(0, 0, ${s * 255});`
// })

// const animatedV = animated(app.pointer.key('point'), {
//   duration: 250,
//   interpolate: (f, t, a) => lerpVec2(f, f, t, a)
// })

// const animatedStyle = useDerived((get) => {
//   const point = get(animatedV)
//   const xy = view.interaction.screenToCanvas(point)
//   return `transform: translate(${xy.x}px, ${xy.y}px) scale(calc(1.0 * var(--card-element-scale)));`
// })

// onBeforeUnmount(() => {
//   animatedV.dispose()
// })
// const animatedStyle = signal((get) => {
//   get(view.infinitykit.canvas.transform)
//   const point = get(app.pointer.key('point'))
//   const xy = view.infinitykit.canvas.screenToCanvas(point)
//   return `transform: translate(${xy.x}px, ${xy.y}px) scale(calc(1.0 * var(--infinitykit-inverted-scale)));`
// })

</script>

<template>
  <div></div>
  <!-- <div class="checker">
    <pre>
      {{ JSON.stringify(s, null, 2) }}
    </pre>
  </div> -->
  <!-- <div class="indicator" :style="animatedStyle"> -->
  <!-- <pre style="transform: scale(var(--card-element-scale))">{{ JSON.stringify(style, null, 2) }}</pre> -->
  <!-- </div> -->
  <!-- <div class="canvas-container" :style="canvasContainer">
    <pre> {{ JSON.stringify(canvasContainer, null, 2) }}</pre>
  </div> -->
  <!-- <div class="box" :style="demoBox">{{ JSON.stringify(demoBox, null, 2) }}</div> -->
  <!-- <Sticker :size="400" text="B" /> -->
</template>

<style scoped>
.box {
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  color: white;
  z-index: 500;
}

.checker {
  position: absolute;
  top: 0;
  left: 0;
  width: 1000px;
  height: 1000px;
  z-index: -1;
  background:
    repeating-conic-gradient(rgb(210, 210, 210) 0% 25%, transparent 0% 50%) 50% / 10px 10px
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background: red;
  opacity: 0.85;
  transform-origin: 0% 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.indicator {
  width: 30px;
  height: 30px;
  left: -15px;
  top: -15px;
  position: absolute;
  mix-blend-mode: difference;
  filter: grayscale();
  background: var(--ui-0);
  /* background: rgba(150, 0, 230, 0.75); */
  pointer-events: none;
  z-index: 10000;
  border-radius: 50%;
}

pre {
  border: 2px dashed black;
  width: 100%;
}
</style>

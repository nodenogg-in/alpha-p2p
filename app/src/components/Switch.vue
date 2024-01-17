<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'

const checked = defineModel<boolean>()
<<<<<<< HEAD
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
=======
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    }
>>>>>>> c1e7f7b (cleaned up directory structure)
})
</script>

<template>
<<<<<<< HEAD
  <div :style="{ display: 'flex', alignItems: 'center' }">
    <SwitchRoot :id="id" v-model:checked="checked" :class="{ root: true }">
      <SwitchThumb class="switch-thumb" />
    </SwitchRoot>
  </div>
=======
    <div :style="{ display: 'flex', alignItems: 'center' }">
        <label class="label" :for="props.id">
            {{ props.label }}
        </label>
        <SwitchRoot :id="props.id" v-model:checked="checked" :class="{ root: true }">
            <SwitchThumb class="switch-thumb" />
        </SwitchRoot>
    </div>
>>>>>>> c1e7f7b (cleaned up directory structure)
</template>

<style>
.root {
<<<<<<< HEAD
  all: unset;
  width: var(--size-24);
  height: var(--size-12);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--size-8);
  position: relative;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.root[data-state='checked'] {
  background-color: rgb(92, 199, 92);
=======
    all: unset;
    width: 32px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 9px;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.root[data-state='checked'] {
    background-color: black;
>>>>>>> c1e7f7b (cleaned up directory structure)
}
</style>
<style scoped>
/* reset */

.switch-thumb:focus {
<<<<<<< HEAD
  box-shadow: 0 0 0 var(--ui-weight) black;
}

.switch-thumb {
  display: block;
  width: var(--size-8);
  height: var(--size-8);
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 var(--ui-weight) var(--ui-weight) var(--black-a7);
  transition: transform 100ms;
  transform: translateX(1px);
  will-change: transform;
}

.switch-thumb[data-state='checked'] {
  transform: translateX(13px);
}

.label {
  line-height: 1;
  margin-right: 10px;
}
</style>
=======
    box-shadow: 0 0 0 2px black;
}


.switch-thumb {
    display: block;
    width: 14px;
    height: 14px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px var(--black-a7);
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
}

.switch-thumb[data-state='checked'] {
    transform: translateX(16px);
}

.label {
    line-height: 1;
    margin-right: 10px;
}
</style>
>>>>>>> c1e7f7b (cleaned up directory structure)

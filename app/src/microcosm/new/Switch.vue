<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'

const checked = defineModel<boolean>()
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div :style="{ display: 'flex', alignItems: 'center' }">
        <label class="label" :for="props.id">
            {{ props.label }}
        </label>
        <SwitchRoot :id="props.id" v-model:checked="checked" :class="{ root: true }">
            <SwitchThumb class="switch-thumb" />
        </SwitchRoot>
    </div>
</template>

<style>
.root {
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
}
</style>
<style scoped>
/* reset */

.switch-thumb:focus {
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
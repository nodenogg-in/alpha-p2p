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
        <SwitchRoot :id="props.id" v-model:checked="checked" :class="{ root: true }">
            <SwitchThumb class="switch-thumb" />
        </SwitchRoot>
    </div>
</template>

<style>
.root {
    all: unset;
    width: 24px;
    height: 12px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.root[data-state='checked'] {
    background-color: rgb(92, 199, 92);
}
</style>
<style scoped>
/* reset */

.switch-thumb:focus {
    box-shadow: 0 0 0 2px black;
}


.switch-thumb {
    display: block;
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px var(--black-a7);
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
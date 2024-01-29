<script lang="ts" setup>
import type { PropType } from 'vue';

const props = defineProps({
    class: {
        type: String,
        default: ''
    },
    autocapitalize: {
        type: String as PropType<HTMLInputElement['autocapitalize']>,
        default: "off"
    },
    spellcheck: {
        type: Boolean as PropType<HTMLInputElement['spellcheck']>,
        default: false
    },
    autocomplete: {
        type: String as PropType<HTMLInputElement['autocomplete']>,
        default: "off"
    }
})

</script>
<template>
    <input v-bind="$attrs" :class="props.class" :autocapitalize="props.autocapitalize" :spellcheck="props.spellcheck"
        :autocomplete="props.autocomplete" />
</template>

<style scoped>
input {
    border: initial;
    padding: 6px;
    width: 100%;
    border-radius: 2px;
    background: var(--ui-90);
    color: var(--ui-0);
    outline: initial;
}

input:focus {
    box-shadow: var(--ui-shadow-accent);
}

@media (prefers-color-scheme: dark) {
    input {
        background: var(--ui-90);
    }
}
</style>
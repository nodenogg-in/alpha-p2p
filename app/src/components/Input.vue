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
defineOptions({
    inheritAttrs: true
})

</script>
<template>
    <input type="text" v-bind="$attrs" :class="props.class" :autocapitalize="props.autocapitalize"
        :spellcheck="props.spellcheck" :autocomplete="props.autocomplete" />
</template>

<style scoped>
input {
    border: initial;
    padding: 6px;
    width: 100%;
    height: 30px;
    border-radius: var(--ui-radius);
    background: var(--ui-90);
    color: var(--ui-0);
    outline: initial;
    caret-color: var(--ui-primary-100);
}

input::placeholder {
    color: var(--ui-50);
    opacity: 1;
}

input:hover:not(:focus) {
    background: var(--ui-primary-20);
}

input:hover:not(:focus)::placeholder {
    color: var(--ui-primary-100);
    opacity: 1;
}

input:focus {
    box-shadow: var(--ui-shadow-primary);
}

@media (prefers-color-scheme: dark) {
    input {
        background: var(--ui-80);
    }
}
</style>
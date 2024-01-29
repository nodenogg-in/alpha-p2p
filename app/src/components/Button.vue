<script lang="ts" setup>

const props = defineProps({
    class: {
        type: String,
        default: ''
    },
    shadow: {
        type: Boolean,
        default: true
    }
})
</script>
<template>
    <button v-bind="$attrs"  :class="{ [props.class]: true, shadow: props.shadow }">
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    cursor: pointer;
    color: var(--ui-0);
    background: var(--ui-100);
    height: 30px;
    padding: 2px 8px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
}

button.shadow {
    box-shadow: var(--ui-shadow);
}

@media (prefers-color-scheme: dark) {
    button {
        background: var(--ui-90);
    }
}

button:has(> svg) {
    padding-left: 2px;
}

button>svg {
    margin-right: 2px;
}

button:hover {
    color: var(--ui-100);
    background: var(--ui-accent-100);
}
</style>
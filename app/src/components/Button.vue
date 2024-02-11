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
    <button v-bind="$attrs" :class="{ base: true, [props.class]: true, shadow: props.shadow }">
        <slot></slot>
    </button>
</template>

<style scoped>
.base {
    width: fit-content;
    cursor: pointer;
    color: var(--ui-0);
    background: var(--ui-100);
    height: 30px;
    padding: 2px 8px;
    border-radius: var(--ui-radius);
    display: flex;
    align-items: center;
    font-weight: 500;
    user-select: none;
}

.base :global(*) {
    font-weight: 500;
}

.base.shadow {
    box-shadow: var(--ui-shadow-10);
}

@media (prefers-color-scheme: dark) {
    .base {
        background: var(--ui-90);
    }
}

.base:has(> svg) {
    padding-left: 2px;
}

.base :global(> svg) {
    margin-right: 5px;
}

.base:hover {
    color: var(--ui-100);
    background: var(--ui-primary-100);
}

.base.shadow:focus,
.base:focus {
    box-shadow: var(--ui-shadow-primary);
}
</style>
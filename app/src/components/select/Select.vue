<script setup lang="ts">
import {
    SelectContent,
    SelectGroup,
    SelectPortal,
    SelectRoot,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from 'radix-vue'
import Icon from '../icon/Icon.vue';

const value = defineModel<string>()

defineProps({
    placeholder: {
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
    <SelectRoot v-model="value" v-bind="$attrs">
        <SelectTrigger class="select-trigger" :aria-label="label">
            <SelectValue class="select-value" :placeholder="placeholder" />
            <Icon type="chevron" :size="20" style="transform: rotate(90deg);" />
        </SelectTrigger>

        <SelectPortal>
            <SelectContent class="select-content ui" :side-offset="5">
                <SelectScrollUpButton class="select-scroll-button">
                    <Icon type="chevron" />
                </SelectScrollUpButton>

                <SelectViewport class="select-viewport">
                    <SelectGroup>
                        <slot></slot>
                    </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton class="select-scroll-button">
                    <Icon type="chevron" class="" />
                </SelectScrollDownButton>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>

<style>
.select-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--ui-radius);
    width: fit-content;
    line-height: 1;
    height: var(--size-32);
    color: var(--ui-0);
    background: var(--ui-95);
    cursor: pointer;
    box-shadow: var(--ui-shadow-10);
    padding-right: var(--size-4);
}

@media (prefers-color-scheme: dark) {
    .select-trigger {
        background: var(--ui-90);
    }
}

.select-value {
    padding: 0 0 0 var(--size-8);
    text-transform: capitalize !important;
}

.select-trigger:hover {
    color: var(--ui-mono-100);
    background-color: var(--ui-primary-100);
}

.select-trigger:focus {
    box-shadow: var(--ui-shadow-primary);
}

.select-trigger[data-placeholder] {
    color: var(--ui-50);
}

.select-content {
    z-index: 10000;
    overflow: hidden;
    background-color: var(--ui-100);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-10);

    /* box-shadow: var(--ui-shadow-10); */
    /* width: calc(100% - var(--size-32)); */
}


.select-scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-32);
    background: var(--ui-80);
    cursor: default;
}

@media (prefers-color-scheme: dark) {
    .select-scroll-button {
        background: var(--ui-70);
    }
}
</style>
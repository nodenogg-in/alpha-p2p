<!-- <script setup lang="ts">
import { ref } from 'vue'
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectLabel,
    SelectPortal,
    SelectRoot,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from 'radix-vue'
import './styles.css'

const fruit = ref()

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
</script>

<template>
    <SelectRoot v-model="fruit">
        <SelectTrigger class="SelectTrigger" aria-label="Choose view">
            <SelectValue placeholder="View..." />
            Down
        </SelectTrigger>

        <SelectPortal>
            <SelectContent class="SelectContent" :side-offset="5">
                <SelectScrollUpButton class="SelectScrollButton">
                    Up
                </SelectScrollUpButton>

                <SelectViewport class="SelectViewport">
                    <SelectGroup>
                        <SelectItem v-for="(option, index) in options" :key="index" class="SelectItem" :value="option">
                            <SelectItemIndicator class="SelectItemIndicator">
                                Y
                            </SelectItemIndicator>
                            <SelectItemText>
                                {{ option }}
                            </SelectItemText>
                        </SelectItem>
                    </SelectGroup>
                </SelectViewport>

                <SelectScrollDownButton class="SelectScrollButton">
                    <Icon icon="radix-icons:chevron-down" />
                </SelectScrollDownButton>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>

<style>
.SelectTrigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 13px;
    line-height: 1;
    height: 35px;
    gap: 5px;
    background-color: white;
    color: var(--grass-11);
    box-shadow: 0 2px 10px var(--black-a7);
}

.SelectTrigger:hover {
    background-color: var(--mauve-3);
}

.SelectTrigger:focus {
    box-shadow: 0 0 0 2px black;
}

.SelectTrigger[data-placeholder] {
    color: var(--grass-9);
}

.SelectIcon {
    color: Var(--grass-11);
}

.SelectContent {
    overflow: hidden;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

.SelectViewport {
    padding: 5px;
}

.SelectItem {
    font-size: 13px;
    line-height: 1;
    color: var(--grass-11);
    border-radius: 3px;
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0 35px 0 25px;
    position: relative;
    user-select: none;
}

.SelectItem[data-disabled] {
    color: var(--mauve-8);
    pointer-events: none;
}

.SelectItem[data-highlighted] {
    outline: none;
    background-color: var(--grass-9);
    color: var(--grass-1);
}

.SelectLabel {
    padding: 0 25px;
    font-size: 12px;
    line-height: 25px;
    color: var(--mauve-11);
}

.SelectSeparator {
    height: 1px;
    background-color: var(--grass-6);
    margin: 5px;
}

.SelectItemIndicator {
    position: absolute;
    left: 0;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.SelectScrollButton {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    background-color: white;
    color: var(--grass-11);
    cursor: default;
}
</style> -->
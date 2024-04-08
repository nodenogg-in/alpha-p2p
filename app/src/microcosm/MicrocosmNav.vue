<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarPortal,
    MenubarRoot,
    MenubarSeparator,
    MenubarTrigger,
} from 'radix-vue'
import { useApp, useCurrentMicrocosm } from '@/state';
import { clamp } from '@nodenogg.in/toolkit';
import Icon from '@/components/icon/Icon.vue';

const microcosm = useCurrentMicrocosm()
const app = useApp()

const peerCount = computed(() =>
    clamp(microcosm.identities.filter((identity) => identity.joined).length - 1, 0)
)

const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
    `${count} ${count === 1 ? singular : plural}`


const microcosmMenu = ref('')

</script>

<template>
    <nav>
        <MenubarRoot v-model="microcosmMenu" class="menubar-root" v-if="!!microcosm">

            <!-- <MenubarDivider /> -->
            <MenubarMenu value="file">
                <MenubarTrigger class="menubar-trigger title">
                    {{ microcosm.title }}
                    <div role="presentation" :class="{
            indicator: true,
            connected: microcosm.status.connected
        }" />
                    <Icon type="ellipsis" />
                </MenubarTrigger>
                <MenubarPortal>
                    <MenubarContent class="menubar-content" align="start" :side-offset="5" :align-offset="-3">
                        <MenubarLabel class="menubar-label">
                            {{ app.device.online ? 'online' : 'offline' }} Connected with {{ pluralize(peerCount,
                            'other') }}
                        </MenubarLabel>
                        <MenubarSeparator class="menubar-separator" />
                        <MenubarItem class="menubar-item">
                            Duplicate
                        </MenubarItem>
                        <MenubarItem class="menubar-item">
                            Save
                            <div class="right-slot">
                                cmd+S
                            </div>
                        </MenubarItem>
                        <MenubarItem class="menubar-item">
                            Copy link
                        </MenubarItem>
                        <MenubarItem class="menubar-item warning">
                            Leave
                        </MenubarItem>
                    </MenubarContent>
                </MenubarPortal>
            </MenubarMenu>
        </MenubarRoot>
    </nav>
</template>

<style scoped>
nav {
    position: absolute;
    z-index: 200;
    inset: 0;
    margin-inline: auto;
    top: var(--size-8);
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    background: var(--ui-95);
    box-shadow: var(--ui-container-shadow);
    border-radius: calc(var(--ui-radius));
    padding: var(--size-4);
    gap: var(--size-2);
}

@media (prefers-color-scheme: dark) {
    nav {
        background: var(--ui-90);

    }
}

.menubar-root {
    display: flex;
    align-items: center;
    gap: var(--size-2);
}

:deep(.menubar-label) {
    display: flex;
    align-items: center;
}

:deep(.title) {
    font-size: 1.1em;
    font-weight: 500;
}

:deep(.menubar-trigger) {
    padding-left: var(--size-8);
    outline: none;
    user-select: none;
    height: var(--size-32);
    border-radius: var(--ui-radius);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
}

:deep(.small) {
    display: block;
    /* font-size: 0.8em; */
    /* letter-spacing: 0.05em; */
    /* font-weight: 600; */
    /* color: var(--ui-60); */
    /* text-transform: uppercase; */
}

:deep(.menubar-trigger:hover),
:deep(.menubar-trigger[data-highlighted]),
:deep(.menubar-trigger[data-state='open']) {
    background-color: var(--ui-80);
}

:deep(.menubar-content:not(.fit)) {
    min-width: 200px;
}

:deep(.menubar-content) {
    background-color: var(--ui-95);
    border-radius: var(--ui-radius);
    padding: var(--size-2);
    gap: var(--size-2);
    box-shadow: var(--ui-container-shadow);
    max-height: calc(100vh - 64px);
    overflow-y: scroll;
}

:deep(.menubar-label) {
    height: var(--size-32);
    padding: 0 var(--size-8);
    user-select: none;
    font-size: 0.8em;
}

:deep(.menubar-item),
:deep(.menubar-sub-trigger),
:deep(.menubar-checkbox-item),
:deep(.menubar-radio-item) {
    cursor: pointer;
    all: unset;
    height: var(--size-32);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding: 0 var(--size-8);
    user-select: none;
}

:deep(.warning) {
    color: var(--ui-orange);
}

:deep(.menubar-item.inset),
:deep(.menubar-sub-trigger.inset),
:deep(.menubar-checkbox-item.inset),
:deep(.menubar-radio-item.inset) {
    padding-left: var(--size-24);
}

:deep(.menubar-item[data-highlighted]),
:deep(.menubar-sub-trigger[data-highlighted]),
:deep(.menubar-checkbox-item[data-highlighted]),
:deep(.menubar-radio-item[data-highlighted]) {
    background: var(--ui-80);
    /* background-image: linear-gradient(135deg, var(--grass-9) 0%, var(--grass-10) 100%); */
}

:deep(.warning[data-highlighted]) {
    color: var(--ui-mono-0);
    background: var(--ui-orange);
}



:deep(.menubar-item-indicator[data-state='checked']) {
    background: red;
}

:deep(.menubar-item-indicator) {
    position: absolute;
    left: var(--size-8);
    width: var(--size-8);
    height: var(--size-8);
    border-radius: var(--size-4);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: currentColor;
}

:deep(.menubar-separator) {
    height: 1px;
    background-color: var(--ui-80);
    margin: 2px;
}

:deep(.right-slot) {
    margin-left: auto;
}

div.indicator {
    width: var(--size-4);
    height: var(--size-4);
    border-radius: 50%;
    background: var(--ui-50);
    margin-left: 0;
    margin-bottom: var(--size-8);
}

div.indicator.connected {
    background: var(--ui-green);
}

aside.status {
    border-radius: var(--size-24);
    height: var(--size-24);
    min-width: var(--size-24);
    padding: 0 var(--size-8);
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 0.8em;
    font-weight: bold;
    margin: 0 var(--size-4);
    background: var(--ui-100);
}

aside.status>p {
    margin-left: 4px;
}
</style>
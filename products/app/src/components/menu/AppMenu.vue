<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarItemIndicator,
    MenubarMenu,
    MenubarPortal,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarRoot,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from 'radix-vue'
import { session, useApp, useCurrentMicrocosm, useCurrentView, views } from '@/state';
import { clamp } from '@figureland/typekit';
import Input from '@/components/input/Input.vue';
import Tooltip from '@/views/spatial/components/Tooltip.vue';
import Button from '@/components/button/Button.vue';
import Icon from '@/components/icon/Icon.vue';
// import MenubarDivider from './MenubarDivider.vue'
import MenuLink from '@/components/menu/MenuLink.vue';
import { paramToString } from '@/state'
import { useRoute } from 'vue-router';
// import { usePersistedSignal } from '@figureland/statekit/vue';
// import MicrocosmList from './MicrocosmList.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import JoinMicrocosmDialog from './JoinMicrocosmDialog.vue';

const app = useApp()
const route = useRoute()

const isRoute = (params: string | string[], uri: string) => paramToString(params) === uri

const menuOpen = ref(false)

const appMenu = ref('')

const onMicrocosmSelect = (e: Event) => {
    console.log('select', menuOpen.value)
    e.stopPropagation()
    if (menuOpen.value) e.preventDefault()
}

</script>

<template>
    <nav>
        <MenubarRoot v-model="appMenu" class="menubar-root">

            <MenubarMenu>
                <MenubarTrigger class="menubar-trigger">
                    <Icon type="menu" />
                </MenubarTrigger>
                <MenubarPortal>
                    <MenubarContent class="menubar-content" align="start" :side-offset="8" :align-offset="-4"
                        :forceMount="menuOpen">
                        <MenubarItem class="menubar-item" v-for="microcosm of app.microcosms"
                            @select="onMicrocosmSelect"
                            v-bind:key="`menu-link-${microcosm.microcosmID}${microcosm.view}`" asChild>
                            <MenuLink :microcosm="microcosm"
                                :active="isRoute(route.params.microcosmID, microcosm.microcosmID)" />
                        </MenubarItem>
                        <MenubarSeparator class="menubar-separator" />
                        <MenubarItem class="menubar-item">
                            View all
                        </MenubarItem>
                        <MenubarCheckboxItem v-model:checked="menuOpen" class="menubar-checkbox-item">
                            <MenubarItemIndicator class="menubar-item-indicator">
                            </MenubarItemIndicator>
                            <Icon type="pin" />
                        </MenubarCheckboxItem>
                    </MenubarContent>
                </MenubarPortal>
            </MenubarMenu>
        </MenubarRoot>
        <JoinMicrocosmDialog />
    </nav>
</template>

<style scoped>
/* .slashed::after {
    content: '/';
    position: absolute;
    right: calc(-1 * var(--size-4));
} */
.slashed {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
}

nav {
    position: absolute;
    z-index: 200;
    inset: 0;
    top: var(--size-8);
    left: var(--size-8);
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
    padding: 0 var(--size-8);
    outline: none;
    user-select: none;
    height: var(--size-32);
    border-radius: 4px;
    color: var(--grass-11);
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
    max-height: calc(100vh - 64px);
    overflow-y: scroll;
    background: var(--ui-95);
    box-shadow: var(--ui-container-shadow);
    border-radius: calc(var(--ui-radius));
    padding: var(--size-4);
    gap: var(--size-2);
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
    cursor: pointer;
    height: var(--size-32);
    border-radius: 4px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 var(--size-8);
    user-select: none;
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

:deep(.RightSlot) {
    margin-left: auto;
    padding-left: var(--size-24);
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
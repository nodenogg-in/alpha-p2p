<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { MicrocosmUUID } from '@nodenogg.in/core';
import MicrocosmQuickMenu from './MicrocosmQuickMenu.vue';
import Tooltip from '@/components/Tooltip.vue';
import { useApp } from '@/state';
import Dialog from '../dialog/Dialog.vue';
import { ref } from 'vue';
import Button from '../button/Button.vue';
import Icon from '../icon/Icon.vue';

const router = useRouter()
const app = useApp()

const handleConfirm = (uuid: MicrocosmUUID) => {
    app.showCommandMenu = false
    router.push({
        name: 'microcosm',
        params: {
            microcosm_uuid: uuid
        }
    })
}
</script>

<template>
    <Tooltip tooltip="New microcosm" command="m" side="bottom" align="start" disableClosingTrigger :delay="200">
        <Button class="menu-button" @click="() => app.showCommandMenu = true">
            <Icon type="plus" :size="32" />
        </Button>
    </Tooltip>
    <Dialog :onConfirm="handleConfirm" v-model:open="app.showCommandMenu" title="Add microcosm"
        description="Add a microcosm name to join">
        <template v-slot:content>
            <MicrocosmQuickMenu :options="[...app.microcosms.sort((a, b) => b.lastAccessed - a.lastAccessed)]"
                :onSelect="handleConfirm" :onCreate="handleConfirm" />
        </template>
    </Dialog>
</template>

<style scoped>
.small {
    display: block;
    padding: var(--size-8) 0;
    font-weight: 600;
    color: var(--ui-50);
    font-size: 12px;
}
</style>
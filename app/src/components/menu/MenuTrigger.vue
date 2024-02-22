<script setup lang="ts">
import { useApp } from '@/state'
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';
import Tooltip from '@/views/spatial/components/Tooltip.vue';

const app = useApp()

</script>
    
<template>
    <Tooltip :tooltip="app.menuOpen ? 'Hide' : 'Show'" :keyCommand="['m']" side="right" disableClosingTrigger :delay="200">
        <Button class="menu-button" @click="app.menuOpen = !app.menuOpen">
            <Icon :type="app.menuOpen ? 'close' : 'stack'" :size="32" />
            Microcosms
        </Button>
    </Tooltip>
</template>
    
<style scoped>
.menu-button {
    position: fixed;
    top: var(--size-12);
    left: var(--size-12);
    z-index: 100;
}
</style>
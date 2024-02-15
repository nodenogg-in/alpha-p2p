<script setup lang="ts">
import { useApp } from '@/state'
import Icon from '../icon/Icon.vue';
import Button from '../Button.vue';
import Tooltip from '@/views/spatial/components/Tooltip.vue';

const app = useApp()

</script>
    
<template>
    <Tooltip :tooltip="app.menuOpen ? 'Hide' : 'Show'" key-command="m" side="right" disableClosingTrigger>
        <Button class="menu-button" @click="app.menuOpen = !app.menuOpen">
            <Icon :type="app.menuOpen ? 'close' : 'stack'" :size="32" />
            Microcosms
        </Button>
    </Tooltip>
</template>
    
<style scoped>
.menu-button {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 100;
}
</style>
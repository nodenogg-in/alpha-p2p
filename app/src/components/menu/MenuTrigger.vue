<script setup lang="ts">
import { useApp } from '@/state'
import Icon from '../icon/Icon.vue';
import Button from '../Button.vue';
import Tooltip from '@/views/spatial/components/Tooltip.vue';

const app = useApp()

</script>
    
<template>
    <Tooltip tooltip="Show microcosms list" key-command="m" side="bottom" disableClosingTrigger>
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
<script setup lang="ts">
import { useApp } from '@/state'
import Icon from '../icon/Icon.vue';
import Button from '../Button.vue';

const app = useApp()

</script>
    
<template>
    <Button class="menu-button" @click="app.sidebarOpen = !app.sidebarOpen">
        <Icon :type="app.sidebarOpen ? 'close' : 'stack'" :size="32" />
        My microcosms
    </Button>
</template>
    
<style scoped>
.menu-button {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 100;
}
</style>@/core/stores
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue';
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { setCSSVariables } from 'nodenoggin-core/utils';
import { onMounted } from 'vue';

onMounted(setCSSVariables)
</script>

<template>
  <TooltipProvider>
    <Sidebar />
    <RouterView />
  </TooltipProvider>
</template>
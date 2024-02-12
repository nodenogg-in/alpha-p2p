<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue';

import { setCSSVariables } from 'nodenoggin-core/ui';

import Sidebar from '@/components/sidebar/Sidebar.vue'

onMounted(setCSSVariables)
</script>

<template>
  <TooltipProvider>
    <Sidebar />
    <RouterView />
  </TooltipProvider>
</template>
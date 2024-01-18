<script setup lang="ts">
import { RouterView } from 'vue-router'
import NNMenu from '@/components/NNMenu.vue';
import AppContainer from './components/containers/AppContainer.vue';
</script>

<template>
  <AppContainer>
    <NNMenu />
    <RouterView />
  </AppContainer>
</template>

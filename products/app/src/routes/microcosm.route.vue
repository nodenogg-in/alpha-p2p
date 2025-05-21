<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'

const data = useAppRouter()
</script>

<template>
  <Microcosm v-if="data.microcosmUUID" :microcosmUUID="data.microcosmUUID"
    v-bind:key="`main/${data.microcosmUUID}/${data.viewType}`" id="main" ui />
</template>
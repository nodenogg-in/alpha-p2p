<script setup lang="ts">
import { useAppRouter } from '@/state'
import { Microcosm } from '@/microcosm'

const data = useAppRouter()
</script>

<template>
  <Microcosm v-if="data.microcosm_uuid" :uuid="data.microcosm_uuid"
    v-bind:key="`main/${data.microcosm_uuid}/${data.viewType}`" id="main" ui />
</template>
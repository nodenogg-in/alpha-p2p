<script setup lang="ts">
import YJSVue from '@/components/demo/YJS.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
</script>

<template>
    <div>
        {{ route.params.microcosm_uri }}
        <YJSVue />
    </div>
</template>
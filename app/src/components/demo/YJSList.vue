<script setup lang="ts">
import type { NodeContent } from '@/types/schema';
import type { PropType } from 'vue';
import type { Map as YMap } from 'yjs';


const props = defineProps({
    map_key: {
        type: String,
        required: true
    }
})

// const ym = useYMap(props.map_key)
</script>

<template>
    <div>
        <!-- {{ JSON.stringify(ym) }} -->
    </div>
</template>
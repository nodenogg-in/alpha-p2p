<script setup lang="ts">
import { type PropType, ref, computed, watch } from 'vue'
import { getTimeSince } from '@figureland/kit/ts/time';
import { sanitizeMicrocosmIDTitle, type MicrocosmID, type MicrocosmReference, createMicrocosmID, parseMicrocosmID, isValidMicrocosmID } from '@nodenogg.in/microcosm'
import { ComboboxContent, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxRoot, ComboboxViewport } from 'radix-vue'
import Input from '../input/Input.vue';

const props = defineProps({
    onCreate: {
        type: Function as PropType<(m: MicrocosmID) => void>,
        required: true
    },
    onSelect: {
        type: Function as PropType<(m: MicrocosmID) => void>,
        required: true
    },
    options: {
        type: Array as PropType<MicrocosmReference[]>,
        required: true
    },
    limit: {
        type: Number,
        default: 10
    },
    placeholder: {
        type: String,
        default: 'Choose a microcosm name...'
    }
})


const inputValue = ref<string>('')
const newMicrocosmID = computed(() => createMicrocosmID(inputValue.value))
const active = ref(false)

watch(inputValue, () => {
    if (!active.value) {
        active.value = !!inputValue.value
    }
})

const inputIsValidMicrocosmID = computed(() => isValidMicrocosmID(inputValue.value))

const existingMicrocosm = computed(() =>
    inputIsValidMicrocosmID.value
    && !!props.options.find(microcosm => microcosm.microcosmID === inputValue.value)
)


const onCreate = () => {
    props.onCreate(newMicrocosmID.value)
}

const filter = (list: (string[]), term: string) =>
    list.filter((option) => {
        return option === 'new' || option.toLocaleLowerCase().startsWith(term.toLocaleLowerCase())
    })

</script>

<template>
    <ComboboxRoot v-model:searchTerm="inputValue" :filter-function="filter">
        <ComboboxInput asChild>
            <Input large :placeholder="placeholder" autoFocus v-on:keyup="(e) => {
    }" />
        </ComboboxInput>
        <ComboboxContent>
            <ComboboxViewport class="viewport">
                <ComboboxItem value="new" asChild @select="onCreate" v-if="!existingMicrocosm">
                    <article class="item new">
                        <p>Create <span class="bold">{{ sanitizeMicrocosmIDTitle(inputValue) }}</span>

                        </p>
                        <div class="instruction">Press<span class="keycommand">↲</span></div>

                        <!-- <p>
                            <small>{{ newMicrocosmID }}</small>
                        </p> -->
                    </article>
                </ComboboxItem>
                <ComboboxGroup>
                    <ComboboxLabel class="group-label">Recent microcosms</ComboboxLabel>
                    <ComboboxItem v-for="(microcosm) in options" :key="microcosm.microcosmID"
                        :value="microcosm.microcosmID" asChild @select.prevent="() => onSelect(microcosm.microcosmID)">
                        <article class="item">
                            <span>{{ parseMicrocosmID(microcosm.microcosmID).title }}<span class="item-id">_{{
        parseMicrocosmID(microcosm.microcosmID).id }}</span></span> <span
                                class="secondary">{{
        getTimeSince(microcosm.lastAccessed)
                                }}</span>
                        </article>
                    </ComboboxItem>
                </ComboboxGroup>
            </ComboboxViewport>
        </ComboboxContent>
        <div v-if="!active" class="instruction-tray">
            <div class="instruction">Press<span class="keycommand" style="padding-top: 0">↓</span>for more options
            </div>
            <!-- <div class="instruction"><span class="keycommand">↲</span>Create -->
            <!-- </div> -->
        </div>
    </ComboboxRoot>
</template>

<style scoped>
.instruction-tray {
    display: flex;
    padding: var(--size-8);
    gap: var(--size-12);
}

.instruction {
    font-size: 0.85em;
}


:deep(.item) {
    padding: var(--size-8);
    display: relative;
    border-radius: var(--ui-radius);
    display: flex;
    justify-content: space-between;
}

:deep(.item.new) {
    margin-top: var(--size-8);
}


:deep(.item[data-highlighted]) {
    background-color: var(--ui-primary-100);
    color: var(--ui-100);
}

/* :deep(.item[data-highlighted])::before { */
/* content: '↲'; */
/* position: absolute; */
/* right: var(--size-8); */
/* } */

.item-id {
    opacity: 0.5;
    color: var(--ui-95);
}

:deep(.bold) {
    font-weight: bold;
}

:deep(.viewport) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-height: 50vh;
    overflow-y: scroll;
    padding: 0 var(--size-4) var(--size-4) var(--size-4);
}

.keycommand {
    padding: var(--size-2) var(--size-4) var(--size-2) var(--size-4);
    font-size: 0.85em;
    line-height: 0.85em;
    margin: 0 var(--size-4);
    position: relative;
    border: 1px solid currentColor;
    border-radius: var(--ui-radius);
}

/* .keycommand::after {
    content: ' ';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    border-radius: var(--ui-radius);
} */

:deep(.group-label) {
    margin-top: var(--size-16);
    padding: var(--size-4) var(--size-8);
    font-weight: 400;
    color: var(--ui-50);
}

.secondary {
    opacity: 0.5;
    font-size: 0.9em;
}
</style>
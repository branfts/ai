<template>
    <v-autocomplete rounded :items="store.form.names" variant="outlined" class="my-3" label="Name" v-model="store.form.name" @update:search="updateSearchHandler" @update:modelValue="autocompleteUpdateHandler" hide-no-data>
        <template v-slot:item="{ item }">
            <v-list-item :to="`/u/${item.value}`">
                <v-list-item-title>{{ item.value }}</v-list-item-title>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>
<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { useAppStore } from '@/store/app'

const { $getNames } = getCurrentInstance().appContext.config.globalProperties
const store = useAppStore()
async function updateSearchHandler(textString) {
    store.form.name = textString
    if (!textString) return
    const names = await $getNames(textString)
    store.form.names = Array.from(new Set([...names, ...store.form.names]))
}
function autocompleteUpdateHandler(value) {
    if (!value) return
    store.form.name = value
}
</script>
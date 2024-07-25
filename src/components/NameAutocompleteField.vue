<template>
    <v-autocomplete rounded :items="store.form.names" variant="outlined" class="my-3" label="Name" v-model="store.form.name" :rules="rules" @update:search="updateSearchHandler" @update:modelValue="autocompleteUpdateHandler" hide-no-data validate-on="blur" autocomplete="off">
        <template v-slot:item="{ item }">
            <v-list-item :to="`/u/${item.value}`">
                <v-list-item-title>{{ item.value }}</v-list-item-title>
                <template v-slot:append>
                    <v-icon icon="list" />
                </template>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>
<script setup>
import { getCurrentInstance } from 'vue'
import { useAppStore } from '@/store/app'

const rules = [
    () => !!store.form.name || 'A username is required.',
    () => /^[a-zA-Z0-9]{2}[a-zA-Z0-9_-]{1,}$/.test(store.form.name) || 'Usernames can only include letters, numbers, underscores, and hyphens. The first two characters must be alphanumeric, and the username must be at least 3 characters long.',
    () => !store.form.names.includes(store.form.name) || 'That username is already taken.',
]
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
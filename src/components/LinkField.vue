<template>
    <v-text-field v-if="!href" variant="outlined" label="URL" v-model="models.url" @keydown.enter="addHandler" rounded>
        <template v-slot:append-inner>
            <v-btn class="node-syntax-toggle-btn mr-2" variant="tonal" size="small" @click="addHandler" text="add" rounded />
        </template>
    </v-text-field>
    <div v-else class="d-flex">
        <v-expansion-panels class="mb-1" flat bg-color="grey-lighten-4" rounded="xl" v-model="panel">
            <v-expansion-panel hide-actions @mouseleave="panel = undefined">
                <v-expansion-panel-title class="d-flex">
                    {{ href }}
                    <v-btn class="d-flex ml-auto justify-end" variant="text" density="compact" size="small" @click="deleteHandler" icon="cancel" />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-text-field v-model="models.title" hide-details density="compact" label="title" variant="plain"></v-text-field>
                    <v-text-field v-model="models.subtitle" hide-details density="compact" label="subtitle" variant="plain"></v-text-field>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>
<style scoped>
:deep() .v-chip__content {
    width: 100%;
}
:deep() .v-expansion-panel-text__wrapper {
    padding-top: 0;
}
:deep() .v-field__input {
    padding-top: 0;
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { isURL } from 'validator'

const panel = ref()
const models = ref({
    url: '',
    title: '',
    subtitle: '',
})
const props = defineProps({
    href: String,
})
const href = ref(props.href)

const emit = defineEmits(['add', 'delete'])
function addHandler() {
    if (!models.value.url) return

    let url

    if (!/^https?:\/\//.test(models.value.url)) {
        url = 'https://' + models.value.url
    }
    if (!isURL(url)) {
        return
    }
    try {
        url = new URL(url)
        href.value = url.href
        emit('add', href.value)
    } catch (e) {
        href.value = undefined
    }
}
function deleteHandler() {
    emit('delete', href.value)
    href.value = undefined
}
</script>
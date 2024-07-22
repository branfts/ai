<template>
    <v-text-field v-if="!props.link?.url" variant="outlined" label="URL" v-model="link.url" @keydown.enter="addHandler" rounded>
        <template v-slot:append-inner>
            <v-btn class="node-syntax-toggle-btn mr-2" variant="tonal" size="small" @click="addHandler" text="add" rounded />
        </template>
    </v-text-field>
    <div v-else class="d-flex">
        <v-expansion-panels class="mb-1" flat bg-color="grey-lighten-4" rounded="xl" v-model="panel">
            <v-expansion-panel hide-actions @mouseleave="panel = undefined">
                <v-expansion-panel-title class="d-flex">
                    {{ link.url }}
                    <v-btn class="d-flex ml-auto justify-end" variant="text" density="compact" size="small" @click="deleteHandler" icon="cancel" />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-text-field v-model="link.title" hide-details density="compact" label="title" variant="plain"></v-text-field>
                    <v-text-field v-model="link.subtitle" hide-details density="compact" label="subtitle" variant="plain"></v-text-field>
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
import { ref, onMounted, watch } from 'vue'
import { isURL } from 'validator'

const panel = ref()
const props = defineProps({
    link: Object,
})
const link = ref({
    url: props.link?.url,
    title: props.link?.title,
    subtitle: props.link?.subtitle,
})
const emit = defineEmits(['add', 'update', 'delete'])

function addHandler() {
    if (!link.value.url) return

    if (!/^https?:\/\//.test(link.value.url)) {
        link.value.url = 'https://' + link.value.url
    }
    if (!isURL(link.value.url)) {
        return
    }
    try {
        new URL(link.value.url)
        emit('add', link.value)
    } catch (e) {
        link.value.url = undefined
    }
}
function deleteHandler() {
    emit('delete', link.value)
}
onMounted(() => {
    watch(() => link.value.title + link.value.subtitle, () => emit('update', link.value))
})
</script>
<template>
    <v-container fluid class="h-100 d-flex flex-column justify-center align-center">
        <v-card flat max-width="500" width="100%">
            <v-card-title>
                A10x
            </v-card-title>
            <v-card-subtitle>
                Like linktr.ee but better for you! <a class="why-link" href="https://github.com/branfts/ai/discussions/7" target="_blank" rel="noopener">Why?</a>
            </v-card-subtitle>
            <v-card-text>
                <v-form>
                    <NameAutocompleteField />
                    <link-field :class="index === links.length - 1 ? 'mt-4' : ''" v-for="(link, index) of links" :key="index" :href="link !== '' ? link : undefined" @add="link => links.unshift(link)" @delete="link => links.splice(links.indexOf(link), 1)" />
                </v-form>
            </v-card-text>
            <v-card-actions class="flex-column justify-center">
                <div class="text-caption mb-4" v-if="auth?.preferred_username">signed in as <span class="font-weight-bold">{{ auth.preferred_username }}</span></div>
                <v-btn class="text-center" variant="tonal" text="submit" :disabled="disabled" @click="submit" />
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<style scoped>
.why-link {
    text-decoration: none;
    position: relative;
    top: -6px;
    right: -6px;
}
</style>
<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { useAppStore } from '@/store/app'

import LinkField from '@/components/LinkField.vue'
import NameAutocompleteField from '@/components/NameAutocompleteField.vue'

const { $api } = getCurrentInstance().appContext.config.globalProperties
const loading = ref(false)
const props = defineProps({
    auth: Object
})
const store = useAppStore()
const links = computed(() => store.form.links)
const disabled = computed(() => !store.form.name || !store.form.links.filter(link => link !== '').length)

async function submit() {
    loading.value = true
    const payload = {
        name: store.form.name,
        links: store.form.links.filter(link => link !== ''),
        rules: store.form.rules.length ? store.form.rules : undefined,
    }
    try {
        const response = await $api.add(props.auth, payload)
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}
</script>
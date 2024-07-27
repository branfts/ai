<template>
    <v-container fluid class="h-100 d-flex flex-column justify-center align-center">
        <flip-board-counter class="justify-center animate__animated animate__fadeIn" title="total indexed users" :modelValue="store.stats?.totalIndexedUsers" />
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
                    <!-- eslint-disable -->
                    <link-field :class="index === links.length - 1 ? 'mt-4' : ''" v-for="(link, index) of links" :key="`${index}-${link.url}`" :link="link"
                                @add="link => !links.find(l => l.url === link.url) && links.unshift(link)"
                                @update="link => store.form.links[links.findIndex(l => l.url !== '' && l.url === link.url)] = link"
                                @delete="link => store.form.links.splice(links.findIndex(l => l.url !== '' && l.url === link.url), 1)" :ref="index === links.length - 1 ? 'inputLinkRef' : undefined" />
                </v-form>
            </v-card-text>
            <v-card-actions class="flex-column justify-center">
                <div class="text-caption mb-4" v-if="auth?.token">
                    signed in as <span class="font-weight-bold">{{ auth.preferred_username }}</span>
                    <v-btn class="ml-2 text-center" variant="tonal" text="Sign Out" size="x-small" to="/signout" />
                </div>
                <div v-else class="text-caption mb-4">
                    Sign in to add links
                    <v-btn class="ml-2 text-center" variant="tonal" text="Sign In" size="x-small" to="/signin" />
                </div>
                <v-btn class="text-center" variant="tonal" text="submit" :disabled="disabled" @click="submit" :loading="loading" />
            </v-card-actions>
            <div class="d-flex justify-center align-center" v-if="checking">
                <v-progress-circular indeterminate color="primary" size="20" :width="1" class="mr-2" />
                <span v-if="checking" class="text-caption animate__animated animate__fadeIn">Checking for {{ newUser }}'s index to become available...</span>
            </div>
            <div class="d-flex justify-center align-center" v-else-if="newUser">
                <v-progress-circular :model-value="100" color="green" size="20" :width="2" class="mr-2" />
                <router-link class="text-caption" :to="`/u/${newUser}`">{{ newUser }}'s index is ready</router-link>
            </div>
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
import { ref, computed, getCurrentInstance, nextTick, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'
import { until } from 'async'

import LinkField from '@/components/LinkField.vue'
import NameAutocompleteField from '@/components/NameAutocompleteField.vue'
import FlipBoardCounter from '../components/FlipBoardCounter.vue'

const emit = defineEmits(['error'])
const { $api, $getHostForName } = getCurrentInstance().appContext.config.globalProperties
const loading = ref(false)
const checking = ref(false)
const newUser = ref()
const props = defineProps({
    auth: Object
})
const store = useAppStore()
const links = computed(() => store.form.links)
const disabled = computed(() => !props.auth?.token ||!store.form.name || !links.value.length)
const inputLinkRef = ref()

async function submit() {
    loading.value = true
    const payload = {
        name: store.form.name,
        links: links.value.filter(link => link.url !== ''),
        rules: store.form.rules.length ? store.form.rules : undefined,
    }
    try {
        await $api.add(props.auth, payload)

        const moduleUrl = `${await $getHostForName(store.form.name)}/u/${store.form.name}.js`
        let attempts = 0

        loading.value = false
        checking.value = true
        newUser.value = store.form.name
        store.resetForm(store)

        await until(
            async () => {
                try {
                    const response = await fetch(moduleUrl, { method: 'HEAD' })

                    attempts += 1
                    return response.ok || attempts > 30
                } catch (e) {
                    return false
                }
            },
            async () => await new Promise(resolve => setTimeout(resolve, 10000))
        )
    } catch (e) {
        emit('error', e)
    } finally {
        loading.value = false
        checking.value = false
    }
}
onMounted(() => {
    watch(store.form.links, async (links, oldLinks) => {
        if (links.length === oldLinks.length) return
        await nextTick()
        inputLinkRef.value[0].$el.querySelector('input').focus()
    })
})
</script>
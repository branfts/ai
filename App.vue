<template>
    <v-app>
        <v-app-bar flat location="bottom" :collapse="collapse" style="opacity: 0.95;" :density="smAndDown ? 'compact' : undefined" class="d-flex align-center">
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click="collapse = !collapse"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title class="font-weight-light"></v-app-bar-title>
            <v-btn v-show="!collapse" v-for="link of links.general" :to="link.to" :href="link.href" variant="text" :target="link.target" :rel="link.rel" class="text-capitalize mr-1" :size="smAndDown ? 'small' : undefined" :class="smAndDown ? 'px-0' : ''" :text="smAndDown && /github/i.test(link.name) ? undefined : link.name" :icon="smAndDown && /github/i.test(link.name) ? true : undefined" rounded>
                <component v-if="link.icon" :is="link.icon" />
                <span v-else v-html="link.name"></span>
            </v-btn>
            <div v-if="!smAndDown" class="text-caption font-weight-light font-italic">build<span class="ml-1 font-weight-bold">{{ MODE === 'production' ? build.slice(-5) : 'dev' }}</span></div>
            <v-spacer></v-spacer>
            <v-btn v-show="!collapse" v-for="link of links.legal" :to="link.to" :href="link.href" variant="text" :size="smAndDown ? 'x-small' : 'small'" class="pa-0 mr-1 text-caption" :text="link.name" />
            <div v-show="!collapse && !smAndDown" class="mx-8 font-weight-light"><span style="font-family: sans-serif">©</span> 2024 June07</div>
            <v-spacer v-if="smAndDown"></v-spacer>
        </v-app-bar>
        <v-navigation-drawer v-if="!smAndDown" order="2" width="200" floating location="left">
            <div class="h-100 d-flex align-center">
                <a href="https://www.digitalocean.com/?refcode=fe4184318b19&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg" style="width: 200px; height: 65px" alt="DigitalOcean Referral Badge" /></a>
            </div>
        </v-navigation-drawer>
        <v-main>
            <router-view v-slot="{ Component, route }">
                <keep-alive>
                    <transition name="custom-classes" :enter-active-class="route.meta.transition || 'animate__animated animate__fadeIn'">
                        <component :auth="auth" :is="Component" @change-theme="store.theme = store.theme === 'light' ? 'dark' : 'light'" @error="errorHandler" />
                    </transition>
                </keep-alive>
            </router-view>
        </v-main>
        <v-navigation-drawer v-if="!smAndDown" order="2" width="200" floating location="right">
            <div class="h-100 d-flex align-center">
                <a href="https://www.digitalocean.com/?refcode=fe4184318b19&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg" style="width: 200px; height: 65px" alt="DigitalOcean Referral Badge" /></a>
            </div>
        </v-navigation-drawer>
        <v-snackbar text :timeout="-1" v-model="snackbar.active" style="opacity: 0.9" @click="snackbarCloseHandler">
            <v-row>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-icon :icon="snackbar.icon" :color="snackbar.iconColor" />
                </v-col>
                <v-col cols="10" class="d-flex align-center justify-center">
                    <div v-if="snackbar.error">
                        <span v-if="snackbar.error?.response?.data">{{ snackbar.error.response.data.match(/Error:([^\.]*)/)?.[1] }}</span>
                        <span v-else>{{ snackbar.error.message }}</span>
                    </div>
                    <span v-else @click="reload" class="font-weight-light" v-bind:class="smAndDown ? 'caption' : ''" style="cursor: pointer">App update available.</span>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-btn variant="plain" :size="smAndDown ? 'x-small' : ''" @click="snackbarCloseHandler"> x </v-btn>
                </v-col>
            </v-row>
        </v-snackbar>
    </v-app>
</template>
<style scoped></style>
<script setup>
import 'animate.css'
import { GitHubIcon } from 'vue3-simple-icons'
import { ref, computed, provide, getCurrentInstance } from "vue"
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAppStore } from '@/store/app'

import { parseSocialLinks } from "./src/utils"

const { MODE } = import.meta.env
const { smAndDown } = useDisplay()
const { $keycloak, $api } = getCurrentInstance().appContext.config.globalProperties
const store = useAppStore()
const build = ref()
const snackbarDefault = {
    active: false,
    error: false,
    icon: 'info',
    message: undefined,
}
const auth = ref()
const collapse = ref(smAndDown.value ? true : false)
const snackbar = ref({ ...snackbarDefault })
const lastBuild = ref()
const buildCheckIntervalId = ref()
const buildInfo = ref()
const links = computed(() => ({
    general: [
        { name: "Home", to: "/" },
        !$keycloak.value.isAuthenticated && { name: "Sign In", to: "/login" },
        { name: "GitHub", href: "https://github.com/branfts/ai/discussions", target: "_blank", rel: "noopener", icon: GitHubIcon },
    ].filter(x => x),
    legal: [
        $keycloak.value.isAuthenticated && { name: "Sign Out", to: "/logout" },
        { name: "Privacy", href: "https://privacy.june07.com" },
        { name: "Terms", href: "https://terms.june07.com" },
    ].filter(x => x),
}))

const checkBuild = async () => {
    buildInfo.value = await $api.buildInfo()

    if (!buildInfo.value?.build_date) {
        return
    }
    build.value = buildInfo.value.commit_sha
    if (lastBuild.value && lastBuild.value?.build_date !== buildInfo.value.build_date) {
        snackbar.value.active = true
        // TODO: put some extra check here...
        resetLocalStorage.value = true
    } else {
        lastBuild.value = buildInfo.value
    }
}
function snackbarCloseHandler() {
    snackbar.value.active = false
    setTimeout(() => {
        snackbar.value = { ...snackbarDefault }
    }, 500)
}
function errorHandler(error) {
    snackbar.value = {
        error,
        active: true,
        iconColor: 'red',
        icon: 'error',
    }
}
function reload() {
    const url = new URL(window.location.href)
    url.searchParams.set('cache', Date.now())
    window.location.href = url.toString()
}
async function doAuth(redirect) {
    await $keycloak.value.isLoaded
    if ($keycloak.value.isAuthenticated) {
        auth.value = {
            token: $keycloak.value.token,
            preferred_username: $keycloak.value.tokenParsed.preferred_username,
            ...auth.value
        }
    }
}
async function updateStats() {
    if (store.stats.lastUpdate && store.stats.lastUpdate > Date.now() - 60 * 60000) {
        if (MODE !== 'production') {
            store.stats = await $api.stats()
            return
        }
    }
    store.stats = await $api.stats()
    store.stats.lastUpdate = Date.now()
}

doAuth()
checkBuild()
updateStats()
buildCheckIntervalId.value = setInterval(checkBuild, 60000)

provide('parseSocialLinks', parseSocialLinks)
</script>

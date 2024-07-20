<template>
    <v-app>
        <v-app-bar flat location="bottom" :collapse="collapse" style="opacity: 0.95;" :density="smAndDown ? 'compact' : undefined" class="d-flex align-center">
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click="collapse = !collapse"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title class="font-weight-light"></v-app-bar-title>
            <v-btn v-show="!collapse" v-for="link of links.general" :to="link.to" :href="link.href" variant="text" :target="link.target" :rel="link.rel" class="text-capitalize" :size="smAndDown ? 'small' : undefined" :class="smAndDown ? 'px-0' : ''" :text="smAndDown && /github/i.test(link.name) ? undefined : link.name" :icon="smAndDown && /github/i.test(link.name) ? true : undefined">
                <component v-if="link.icon" class="mr-2" :is="link.icon" />
                <span v-else v-html="link.name"></span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn v-show="!collapse" v-for="link of links.legal" :to="link.to" :href="link.href" variant="text" :size="smAndDown ? 'x-small' : 'small'" class="pa-0 text-caption" :text="link.name" />
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
                        <component :is="Component" @change-theme="store.theme = store.theme === 'light' ? 'dark' : 'light'" @error="" />
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
                    <span v-if="error">{{ snackbar.message }}</span>
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
import { ref, provide, getCurrentInstance } from "vue"
import { useDisplay } from 'vuetify/lib/framework.mjs'

import { parseSocialLinks } from "./src/utils"

const { smAndDown } = useDisplay()
const { $api } = getCurrentInstance().appContext.config.globalProperties
const version = ref()
const snackbarDefault = {
    active: false,
    icon: 'info',
    message: undefined,
}
const collapse = ref(smAndDown.value ? true : false)
const snackbar = ref({ ...snackbarDefault })
const lastBuild = ref()
const versionCheckIntervalId = ref()
const buildInfo = ref()
const links = {
    general: [
        { name: "Home", to: "/" },
        { name: "GitHub", href: "https://github.com/branfts/qc", target: "_blank", rel: "noopener", icon: GitHubIcon },
    ],
    legal: [
        { name: "Privacy", href: "https://privacy.june07.com" },
        { name: "Terms", href: "https://terms.june07.com" },
    ],
}

const checkVersion = async () => {
    buildInfo.value = await $api.buildInfo()

    if (!buildInfo.value?.build_date) {
        return
    }
    version.value = buildInfo.value.commit_sha
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
        if (error) {
            error.value = false
        }
    })
}
function reload() {
    const url = new URL(window.location.href)
    url.searchParams.set('cache', Date.now())
    window.location.href = url.toString()
}
checkVersion()
versionCheckIntervalId.value = setInterval(checkVersion, 60000)

provide('parseSocialLinks', parseSocialLinks)
</script>

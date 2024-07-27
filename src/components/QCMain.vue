<template>
    <v-container fluid class="h-100">
        <qc-list v-if="user.links" :user="user" :auth="auth" />
        <div class="h-100 d-flex align-center justify-center" v-else-if="loaded">
            <v-img height="300" max-width="300" src="/greg-rosenke-4TpmzpI8Du0-unsplash.jpg" />
            <span style="position: absolute; opacity: 0.2;" class="text-white text-h1">404</span>
        </div>
        <div v-else class="h-100 d-flex align-center justify-center">
            <v-progress-circular :model-value="100" color="green" size="20" :width="2" class="mr-2" />
        </div>
    </v-container>
</template>
<style scoped></style>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import QcList from './QcList.vue'

const { $getHostForName } = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const user = ref({})
const props = defineProps({
    auth: Object
})
const loaded = ref(false)

function isRuleActive(rule) {
    const now = new Date()
    const nowTime = now.toTimeString().split(' ')[0] // Get current time in HH:mm:ss format

    if (rule.startTime && rule.endTime) {
        // Convert rule times to Date objects for comparison
        const startTime = rule.startTime
        const endTime = rule.endTime

        return (!startTime || nowTime >= startTime) && (!endTime || nowTime <= endTime)
    }

    // If no startTime or endTime is defined, the rule is always active
    return true
}
async function asyncInit() {
    const { username } = route.params

    try {
        const userJsModule = `${$getHostForName(username)}/u/${route.params.username}.js`
        const userConfig = username && await import(/* @vite-ignore */userJsModule)
        const { links, rules } = userConfig

        const timeBasedRules = rules.filter(rule => rule.name === 'redirect' && rule.startTime && rule.endTime && isRuleActive(rule))
        const alwaysActiveRules = rules.filter(rule => rule.name === 'redirect' && (!rule.startTime || !rule.endTime))

        // Sort time-based rules by priority
        const sortedTimeBasedRules = timeBasedRules.sort((a, b) => b.priority - a.priority)

        // Determine which rules to apply
        let redirectRule

        if (sortedTimeBasedRules.length > 0) {
            // Apply the highest priority time-based rule
            redirectRule = sortedTimeBasedRules[0]
        } else if (alwaysActiveRules.length > 0) {
            // If no time-based rules are active, apply the highest priority always-active rule
            const sortedAlwaysActiveRules = alwaysActiveRules.sort((a, b) => b.priority - a.priority)
            const highestPriority = sortedAlwaysActiveRules[0].priority
            const highestPriorityRules = sortedAlwaysActiveRules.filter(rule => rule.priority === highestPriority)

            redirectRule = highestPriorityRules[Math.floor(Math.random() * highestPriorityRules.length)]
        }

        if (redirectRule) {
            const index = links.findIndex(link => link.url === redirectRule.url)
            if (index > -1) {
                links[index].redirect = redirectRule
            }
        }

        user.value = { username, links, rules, ...user.value }
    } catch (error) {
        console.error(error)
    } finally {
        loaded.value = true
    }
}
asyncInit()
</script>
<template>
    <v-container fluid>
        <qc-list v-if="user?.links" :user="user" />
        <span v-else>No data...</span>
        <qc-form />
    </v-container>
</template>
<style scoped></style>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import QcList from './QcList.vue'
import QcForm from './QcForm.vue'

const route = useRoute()
const user = ref({})

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
        const userConfig = username && await import(/* @vite-ignore */`/u/${route.params.username}.js`)
        const { links, rules } = userConfig
        const sortedRedirectRules = rules.filter(rule => rule.name === 'redirect' && isRuleActive(rule))
            .sort((a, b) => b.priority - a.priority)

        if (sortedRedirectRules.length > 0) {
            // apply all of the rules we can now
            const redirectRule = sortedRedirectRules[0]
            if (redirectRule) {
                const index = links.findIndex(link => link.href === redirectRule.href)
                if (index > -1) {
                    links[index].redirect = redirectRule
                }
            }
        }

        user.value = { username, links, rules, ...user.value }
    } catch (error) {
        console.error(error)
    }
}
asyncInit()
</script>
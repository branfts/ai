import { defineStore } from "pinia"

const reset = {
    form: {
        name: undefined,
        names: [],
        links: [{
            url: ''
        }],
        rules: []
    }
}
export const useAppStore = defineStore("app", {
    state: () => ({
        faq: {},
        analytics: {
        },
        form: JSON.parse(JSON.stringify(reset.form)),
    }),
    actions: {
        resetForm(state) {
            state.form = JSON.parse(JSON.stringify(reset.form))
        },
    },
    persist: true,
})

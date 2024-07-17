import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        faq: {},
        analytics: {
        }
    }),
    persist: true,
})

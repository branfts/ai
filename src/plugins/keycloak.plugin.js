import { until } from 'async'
import Keycloak from 'keycloak-js'
import { ref } from 'vue'

const keycloakPlugin = {
    async install(app, options) {
        const keycloak = ref(new Keycloak(options.keycloakConfig))

        delete options.keycloakConfig

        keycloak.value.isLoading = true
        keycloak.value.isLoaded = new Promise(resolve => until(
            callback => { /** console.log('.'); */callback(null, keycloak.value.isAuthenticated !== undefined) },
            async () => await new Promise(resolve => setTimeout(resolve)),
            () => {
                keycloak.value.isLoading = false
                resolve(true)
            }
        ))
        // Expose $keycloak as a computed property
        app.config.globalProperties.$keycloak = keycloak

        try {
            // Initialize Keycloak and set it to keycloakRef
            keycloak.value.isAuthenticated = await keycloak.value.init(options)
        } catch (error) {
            console.error('Failed to initialize adapter:', error);
        }
    },
}

export default keycloakPlugin

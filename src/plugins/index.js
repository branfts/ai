/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import api from './api.plugin'
import clipboard from './clipboard.plugin'
import router from './router'
import keycloakPlugin from './keycloak.plugin'
import VueSocialSharing from 'vue-social-sharing'

const {
    VITE_APP_KEYCLOAK_URL,
    VITE_APP_KEYCLOAK_REALM,
    VITE_APP_KEYCLOAK_CLIENT_ID
} = import.meta.env

pinia.use(piniaPluginPersistedstate)

export function registerPlugins(app) {
    app
        .use(keycloakPlugin, {
            keycloakConfig: {
                url: VITE_APP_KEYCLOAK_URL,
                realm: VITE_APP_KEYCLOAK_REALM,
                clientId: VITE_APP_KEYCLOAK_CLIENT_ID
            },
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`
        })
        .use(pinia)
        .use(router)
        .use(vuetify)
        .use(api)
        .use(VueSocialSharing)
    app.provide('clipboard', clipboard)
}

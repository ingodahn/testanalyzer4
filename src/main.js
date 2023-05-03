/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
// import { createApp } from 'vue/dist/vue.esm-bundler'  // Alternative: ESM Bundler für i18n

// Plugins
import { registerPlugins } from '@/plugins'

//Autoregistering layouts
import { registerLayouts } from '@/layouts/register';

import i18n from "./i18n";

const app = createApp(App)

registerPlugins(app)

registerLayouts(app)

app.use(i18n)

app.mount('#app')

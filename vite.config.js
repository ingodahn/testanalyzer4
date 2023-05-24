// Plugins
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
//import legacy from '@vitejs/plugin-legacy'

// Utilities
import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/testanalyzer/',
  optimizeDeps: {
    include: ['vue', 'vue-router','@intlify/vite-plugin-vue-i18n']
  },
  build: {
    rollupOptions: {
      output: {
        sanitizeHtml: false,
      },
    },
  },
  plugins: [
    /*
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    */
    vue({
      template: { transformAssetUrls }
    }),
    // https://lokalise.com/blog/vue-i18n/#Installing_and_configuring_the_Vue_I18n_plugin
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'), // provide a path to the folder where you'll store translation data (see below)
      strictMessage: false
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    fs: {
      strict: false
    }
  },
})

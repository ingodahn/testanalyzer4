import { createI18n } from "vue-i18n";

// Test messages
const messages = {
    en: {
      pSystem: "pSystem-en",
      "Test": {
        "title": "Testtitle-2-en"
      }
    },
    de: {
      pSystem: "pSystem-de",
      "Test": {
        "title": "Testtitel-2-de"
      }
    },
  }

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages
})
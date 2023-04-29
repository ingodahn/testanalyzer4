import { createI18n } from "vue-i18n";

import de from "./locales/de.json";
import en from "./locales/en.json";
import getBrowserLocale from "@/util/i18n/get-browser-locale.js";
import { supportedLocalesInclude } from "@/util/i18n/supported-locales";

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });
  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale;
  } else {
    return process.env.VUE_APP_I18N_LOCALE || "en";
  }
}

const startingLocale = getStartingLocale();

export default createI18n({
  //locale: import.meta.env.VITE_DEFAULT_LOCALE,
  locale: startingLocale,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: {
    en,
    de
  }
})
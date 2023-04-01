//import Vue from "vue";
//import VueI18n from "vue-i18n";
import { createI18n } from 'vue-i18n'
import getBrowserLocale from "@/util/i18n/get-browser-locale";
import { supportedLocalesInclude } from "./util/i18n/supported-locales";

//Vue.use(VueI18n);

// Test messages
const messages = {
  en: {
    pSystem: "pSystem-en",
    "Test": {
      "title": "Testtitle-en"
    }
  },
  de: {
    pSystem: "pSystem-de",
    "Test": {
      "title": "Testtitel-de"
    }
  },
}



function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });
  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale;
  } else {
    return process.env.VUE_APP_I18N_LOCALE || "en";
  }
}

const startingLocale = getStartingLocale();
/*
const i18n = new VueI18n({
  locale: startingLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "de",
  messages: {}
});

const i18n = createI18n({
  locale: startingLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "de",
  messages: {}
})

const loadedLanguages = [];
export function loadLocaleMessagesAsync(locale) {
  if (loadedLanguages.length > 0 && i18n.locale === locale) {
    return Promise.resolve(locale);
  }
  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    i18n.locale = locale;
    return Promise.resolve(locale);
  }
  // If the language hasn't been loaded yet
  return import(
     `@/locales/${locale}.json`
  ).then(messages => {
    i18n.setLocaleMessage(locale, messages.default);
    loadedLanguages.push(locale);
    i18n.locale = locale;
    return Promise.resolve(locale);
  });
}
loadLocaleMessagesAsync(startingLocale);
export default i18n;
*/

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

/*
export default createI18n({
  //locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  locale: startingLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})
*/
export default createI18n({
  //locale: import.meta.env.VITE_DEFAULT_LOCALE,
  locale: startingLocale,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE, 
  legacy: false, // you must specify 'legacy: false' option
  globalInjection: true,
  messages
})

import i18n from "@/i18n"
import { nextTick } from "vue"

const Trans = {
    async switchLanguage(newLocale) { // switch the current locale
        await Trans.loadLocaleMessages(newLocale)
        Trans.currentLocale = newLocale
        document.querySelector("html").setAttribute("lang", newLocale)
        localStorage.setItem("user-locale", newLocale)
    },
    async loadLocaleMessages(locale) {
        if (!i18n.global.availableLocales.includes(locale)) {
            const messages = await import(`@/i18n/locales/${locale}.json`)
            i18n.global.setLocaleMessage(locale, messages.default)
        }

        return nextTick() // wait for the messages to be set
    },
    get defaultLocale() {
        return import.meta.env.VITE_DEFAULT_LOCALE
    },
    guessDefaultLocale() {
        const userPersistedLocale = Trans.getPersistedLocale()
        if (userPersistedLocale) {
            return userPersistedLocale
        }
        const userPreferredLocale = Trans.getUserLocale()
        if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
            return userPreferredLocale.locale
        }
        if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
            return userPreferredLocale.localeNoRegion
        }

        return Trans.defaultLocale
    },
    isLocaleSupported(locale) { // check if the locale is supported
        return Trans.supportedLocales.includes(locale)
    },
    getUserLocale() { // get the user locale from browser
        const locale = window.navigator.language ||
            window.navigator.userLanguage ||
            Trans.defaultLocale
        return {
            locale: locale,
            localeNoRegion: locale.split('-')[0]
        }
    },
    getPersistedLocale() { // 
        const persistedLocale = localStorage.getItem("user-locale")
        if (Trans.isLocaleSupported(persistedLocale)) {
            return persistedLocale
        } else {
            return null
        }
    },
    get supportedLocales() {
        return import.meta.env.VITE_SUPPORTED_LOCALES.split(",")
    },
    set currentLocale(newLocale) { // set the current locale
        i18n.global.locale.value = newLocale
    },

    async routeMiddleware(to, _from, next) {
        const paramLocale = to.params.locale
        if (!Trans.isLocaleSupported(paramLocale)) {
            return next(Trans.guessDefaultLocale())
        }
        await Trans.switchLanguage(paramLocale)
        return next()
    }
}

export default Trans
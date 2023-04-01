import i18n from "@/i18n"

const Trans = {
    get supportedLocales() {
        return import.meta.env.VITE_SUPPORTED_LOCALES.split(",")
    },
    set currentLocale(newLocale) { // set the current locale
        i18n.global.locale.value = newLocale
      },
      async switchLanguage(newLocale) { // switch the current locale
        Trans.currentLocale = newLocale
        document.querySelector("html").setAttribute("lang", newLocale)
      }
}

export default Trans
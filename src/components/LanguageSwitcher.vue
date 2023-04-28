<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"><v-icon icon="mdi-web" color="white"/></v-btn>
      </template>

      <v-list>
        <v-list-item v-for="sLocale in newLocales" :key="`locale-${sLocale}`" :value="sLocale"
          @click="selectLanguage(sLocale)">
          <v-list-item-title>{{ t(`locale.${sLocale}`) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!--
    <select @change="switchLanguage">
      <option v-for="sLocale in supportedLocales" :key="`locale-${sLocale}`" :value="sLocale"
        :selected="locale === sLocale">
        {{ t(`locale.${sLocale}`) }}
      </option>
    </select>
    -->

  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
//import { useRouter } from "vue-router"
import Tr from "@/i18n/translation"

export default {
  data() {
    return {
      supportedLocales: Tr.supportedLocales,
    }
  },
  computed: {
    newLocales() {
      return this.supportedLocales.filter((locale) => locale !== this.locale)
    },
  },
  methods: {
    async selectLanguage(item) {
      console.log('Locale:', this.locale)
      console.log('Selected item', item);
      const newLocale = item
      await Tr.switchLanguage(newLocale)
      /*
      try {
        await router.replace({ params: { locale: newLocale } })
      } catch (e) {
        router.push("/")
      }
      */
    },
  },
  setup() {

    const { t, locale } = useI18n()

    const supportedLocales = Tr.supportedLocales
    //const router = useRouter()

    const switchLanguage = async (event) => {

      const newLocale = event.target.value

      await Tr.switchLanguage(newLocale)
      /*
      try {
        await router.replace({ params: { locale: newLocale } })
      } catch (e) {
        router.push("/")
      }
      */
    }

    return { t, locale, supportedLocales, switchLanguage }
  }
}
</script>
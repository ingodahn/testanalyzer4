<template>
  <div>   
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn color="primary"  v-bind="props">🌐</v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value=item.value @click="selectLanguage(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    
    <select @change="switchLanguage">
      <option v-for="sLocale in supportedLocales" :key="`locale-${sLocale}`" :value="sLocale"
        :selected="locale === sLocale">
        {{ t(`locale.${sLocale}`) }}
      </option>
    </select>
    <!--
    <v-menu v-model="selectedLanguage">
      <template v-slot:activator="{ on }">
        <v-btn dark color="primary" v-on="on || {}">
          🌐
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="sLocale in supportedLocales"
          :key="`locale-${sLocale}`" :value="sLocale"
          @click="switchLanguage"
        >
          
            <v-list-item-title>{{ t(`locale.${sLocale}`) }}</v-list-item-title>
          
        </v-list-item>
      </v-list>
    </v-menu>
  -->
  </div>
</template>
<script>
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router"
import Tr from "@/i18n/translation"

export default {
  data() {
    return {
      selectedLanguage: 'de',
      
      items: [
        { title: 'English', value: 'en' },
        { title: 'Deutsch', value: 'de' },
      ],
      
      //items: ['Item 1', 'Item 2', 'Item 3'],
    }
  },
  methods: {
    async selectLanguage(item)  {
      console.log(`Selected item ${item.value}`);
      const newLocale = item.value
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
    const router = useRouter()

    methods: [
      switchLanguage2
    ]
    function switchLanguage2() {
      console.log(this.selectedLanguage)
    }
    const switchLanguage1 = async (event) => {
      console.log(event.target.value)

      const newLocale = this.selectedLanguage

      await Tr.switchLanguage(newLocale)

      try {
        await router.replace({ params: { locale: newLocale } })
      } catch (e) {
        router.push("/")
      }
    }

    const switchLanguage = async (event) => {

      const newLocale = event.target.value

      await Tr.switchLanguage(newLocale)

      try {
        await router.replace({ params: { locale: newLocale } })
      } catch (e) {
        router.push("/")
      }
    }

    return { t, locale, supportedLocales, switchLanguage }
  }
}
</script>
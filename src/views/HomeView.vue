<template>
    <h2>Home View</h2>
    <p>Titel: {{ $t("Test.title") }}</p>
    <component :is="componentToLoad" :key="componentLocale"/>
</template>

<script>
import { useRoute } from "vue-router";
import { watch } from 'vue'
import HomeViewDe from '@/views/de/HomeView.vue'
import HomeViewEn from '@/views/en/HomeView.vue'

//import Home from "@/views/${param}/HomeView.vue";
export default {
    components: {
        HomeViewDe,
        HomeViewEn
    },
    setup() {
        let myComponent=this
    const route = useRoute()
    const locale = route.params.locale

    watch(() => route.params.locale, function (newLocale) {
  if (newLocale === 'de') {
    myComponent.componentToLoad = 'HomeViewDe'
  } else {
    myComponent.componentToLoad = 'HomeViewEn'
  }
})
/*
    watch(() => route.params.locale, (newLocale) => {
      if (newLocale === 'de') {
        this.componentToLoad = 'HomeViewDe'
      } else {
        this.componentToLoad = 'HomeViewEn'
      }
    })

*/

    return {
        componentToLoad: locale === 'de' ? HomeViewDe : HomeViewEn,
        componentLocale: locale
    }
    // ...
  },
  /*
  components: {
        Home
    }
    */
}
</script>
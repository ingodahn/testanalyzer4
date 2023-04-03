<template>
  <v-app-bar app color="#2481a8" absolute>

    <v-icon icon="mdi-circle-slice-4" />
    <v-app-bar-title class="white--text">
      <span class="apptitle">{{ $t("Test.title") }}</span>
    </v-app-bar-title>



    <v-spacer></v-spacer>
    <LanguageSwitcher></LanguageSwitcher>
  </v-app-bar>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
export default {
  components: { LanguageSwitcher }
}
</script>

<style scoped>
.apptitle {
  color: white;
}
</style>
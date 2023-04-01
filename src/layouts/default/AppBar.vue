<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />

      Base Preset {{ $t("Test.title") }}
    </v-app-bar-title>
    <LanguageSwitcher></LanguageSwitcher>
  </v-app-bar>
</template>

<script>
  import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
  export default {
    components: { LanguageSwitcher }
  }
</script>

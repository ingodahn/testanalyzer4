<template>
  <v-app-bar app color="#2481a8" absolute>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />

      <span class="apptitle">{{ $t("Test.title") }}</span> 
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

<style scoped>
  .apptitle {
    color: white;
  }
  </style>